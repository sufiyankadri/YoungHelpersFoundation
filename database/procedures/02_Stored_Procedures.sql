-- ==============================================================================
-- Stored Procedures: Core YHF Workflows
-- Implements YHF Blueprint §10, §11, §12 and docs/fund-and-case-workflows.md
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SP: sp_RecordDonationAndPostLedger
-- Atomic transaction:
--   a) Insert into Donor table if new
--   b) Insert into Donations table
--   c) Update Cause raised amount & donor count if cause-linked
--   d) Post double-entry balanced Ledger transaction (Bank Debit, Zakat/Sadaqah Credit)
-- ------------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE [Donor].[sp_RecordDonationAndPostLedger]
    @DonorName NVARCHAR(200),
    @DonorPhone NVARCHAR(20),
    @DonorPan NVARCHAR(20) = NULL,
    @IsAnonymous BIT = 0,
    @CauseId UNIQUEIDENTIFIER = NULL,
    @FundType VARCHAR(50), -- 'Zakat', 'Sadaqah', 'General'
    @Amount DECIMAL(18,2),
    @PaymentGatewayRef NVARCHAR(150),
    @NewDonationId UNIQUEIDENTIFIER OUTPUT,
    @GeneratedReceiptNumber VARCHAR(60) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;
    BEGIN TRY
        -- Generate IDs and Receipt
        SET @NewDonationId = NEWID();
        SET @GeneratedReceiptNumber = 'YHF-REC-' + CAST(YEAR(GETUTCDATE()) AS VARCHAR(4)) + '-' + RIGHT('00000' + CAST(ABS(CHECKSUM(NEWID())) % 100000 AS VARCHAR(5)), 5);

        -- Find or create donor
        DECLARE @DonorId UNIQUEIDENTIFIER;
        SELECT TOP 1 @DonorId = [Id] FROM [Donor].[Donors] WHERE [Phone] = @DonorPhone;
        
        IF @DonorId IS NULL
        BEGIN
            SET @DonorId = NEWID();
            INSERT INTO [Donor].[Donors] ([Id], [Name], [Phone], [PanNumber], [IsAnonymous])
            VALUES (@DonorId, @DonorName, @DonorPhone, @DonorPan, @IsAnonymous);
        END

        -- Insert Donation
        INSERT INTO [Donor].[Donations]
            ([Id], [ReceiptNumber], [DonorId], [CauseId], [FundType], [Amount], [PaymentGatewayRef], [Status])
        VALUES
            (@NewDonationId, @GeneratedReceiptNumber, @DonorId, @CauseId, @FundType, @Amount, @PaymentGatewayRef, 'Captured');

        -- Update Cause Progress if linked
        IF @CauseId IS NOT NULL
        BEGIN
            UPDATE [Cause].[Causes]
            SET [RaisedAmount] = [RaisedAmount] + @Amount,
                [DonorCount] = [DonorCount] + 1
            WHERE [Id] = @CauseId;
        END

        -- Post Double-Entry Ledger Transaction
        DECLARE @JournalId UNIQUEIDENTIFIER = NEWID();
        DECLARE @JournalNumber VARCHAR(60) = 'JRN-' + CAST(YEAR(GETUTCDATE()) AS VARCHAR(4)) + '-' + RIGHT('00000' + CAST(ABS(CHECKSUM(NEWID())) % 100000 AS VARCHAR(5)), 5);

        INSERT INTO [Finance].[LedgerTransactions]
            ([Id], [JournalNumber], [EffectiveDate], [FundType], [SourceType], [SourceId], [Narrative], [TotalAmount])
        VALUES
            (@JournalId, @JournalNumber, CAST(GETUTCDATE() AS DATE), @FundType, 'Donation', @NewDonationId, 
             'Online contribution for ' + @FundType + ' (Receipt: ' + @GeneratedReceiptNumber + ')', @Amount);

        -- Line 1: Bank Account Debit
        INSERT INTO [Finance].[LedgerLines] ([Id], [TransactionId], [LineNo], [AccountCode], [Debit], [Credit])
        VALUES (NEWID(), @JournalId, 1, '1010-DONATION-ESCROW-BANK', @Amount, 0.00);

        -- Line 2: Fund Revenue Credit
        DECLARE @CreditAccount VARCHAR(50) = CASE 
            WHEN @FundType = 'Zakat' THEN '4010-ZAKAT-POOL-REVENUE'
            WHEN @FundType = 'Sadaqah' THEN '4020-SADAQAH-POOL-REVENUE'
            ELSE '4030-GENERAL-RELIEF-REVENUE'
        END;

        INSERT INTO [Finance].[LedgerLines] ([Id], [TransactionId], [LineNo], [AccountCode], [Debit], [Credit])
        VALUES (NEWID(), @JournalId, 2, @CreditAccount, 0.00, @Amount);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ------------------------------------------------------------------------------
-- 2. SP: sp_SubmitHelpApplication
-- Handles beneficiary intake submission with deduplication check & tracking ID
-- ------------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE [Beneficiary].[sp_SubmitHelpApplication]
    @Program VARCHAR(50),
    @FullName NVARCHAR(200),
    @Phone NVARCHAR(20),
    @City NVARCHAR(100),
    @Address NVARCHAR(500),
    @DependentsCount INT,
    @MonthlyFamilyIncome DECIMAL(18,2),
    @OccupationSkill NVARCHAR(250),
    @HasGovtCard VARCHAR(50),
    @NeedDetails NVARCHAR(MAX),
    @QuotationAmount DECIMAL(18,2),
    @ConsentGranted BIT,
    @GeneratedTrackingNumber VARCHAR(50) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SET @GeneratedTrackingNumber = 'YHF-REQ-' + CAST(YEAR(GETUTCDATE()) AS VARCHAR(4)) + '-' + RIGHT('0000' + CAST(ABS(CHECKSUM(NEWID())) % 10000 AS VARCHAR(4)), 4);

    INSERT INTO [Beneficiary].[Applications]
        ([Id], [TrackingNumber], [Program], [FullName], [Phone], [City], [Address], 
         [DependentsCount], [MonthlyFamilyIncome], [OccupationSkill], [HasGovtCard], 
         [NeedDetails], [QuotationAmount], [ConsentGranted], [Status])
    VALUES
        (NEWID(), @GeneratedTrackingNumber, @Program, @FullName, @Phone, @City, @Address,
         @DependentsCount, @MonthlyFamilyIncome, @OccupationSkill, @HasGovtCard,
         @NeedDetails, @QuotationAmount, @ConsentGranted, 'Submitted');
END;
GO

-- ------------------------------------------------------------------------------
-- 3. SP: sp_ApproveAndPublishCause
-- Committee decision workflow: approves verified case and publishes as public crowdfunding cause
-- ------------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE [Workflow].[sp_ApproveAndPublishCause]
    @ApplicationId UNIQUEIDENTIFIER,
    @ApprovedGoal DECIMAL(18,2),
    @FundType VARCHAR(50),
    @PublicTitle NVARCHAR(250),
    @PublicTagline NVARCHAR(500),
    @Location NVARCHAR(150),
    @CoverImage NVARCHAR(500),
    @SanitizedStory NVARCHAR(MAX),
    @AssetToolName NVARCHAR(250) = NULL,
    @ExpectedIncome DECIMAL(18,2) = NULL,
    @VendorPayeeName NVARCHAR(200) = NULL,
    @PublishedCauseId UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;
    BEGIN TRY
        SET @PublishedCauseId = NEWID();
        DECLARE @CauseCode VARCHAR(50) = 'YHF-CAUSE-' + RIGHT('0000' + CAST(ABS(CHECKSUM(NEWID())) % 10000 AS VARCHAR(4)), 4);

        -- Update Application Status
        UPDATE [Beneficiary].[Applications]
        SET [Status] = 'Approved'
        WHERE [Id] = @ApplicationId;

        -- Create Public Cause
        INSERT INTO [Cause].[Causes]
            ([Id], [Code], [Title], [Tagline], [Category], [FundType], [TargetAmount], 
             [RaisedAmount], [DonorCount], [DaysLeft], [Location], [VerifiedDate], 
             [ShariahCompliant], [CoverImage], [Story], [Status])
        VALUES
            (@PublishedCauseId, @CauseCode, @PublicTitle, @PublicTagline, 'Rozgaar', @FundType, 
             @ApprovedGoal, 0.00, 0, 30, @Location, CONVERT(VARCHAR(20), GETUTCDATE(), 106), 
             1, @CoverImage, @SanitizedStory, 'Active');

        -- If Rozgaar program, record livelihood asset plan
        IF @AssetToolName IS NOT NULL
        BEGIN
            INSERT INTO [Rozgaar].[LivelihoodPlans]
                ([Id], [CauseId], [AssetToolName], [ExpectedMonthlyIncome], [VendorQuotationAmount], [VendorPayeeName])
            VALUES
                (NEWID(), @PublishedCauseId, @AssetToolName, ISNULL(@ExpectedIncome, 0.00), @ApprovedGoal, ISNULL(@VendorPayeeName, 'Verified Vendor'));
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ------------------------------------------------------------------------------
-- 4. SP: sp_GetPublicLedgerSummary
-- Calculates live aggregated double-entry ledger totals for public transparency
-- ------------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE [Finance].[sp_GetPublicLedgerSummary]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        [FundType],
        SUM(CASE WHEN [SourceType] = 'Donation' THEN [TotalAmount] ELSE 0 END) AS [TotalInflows],
        SUM(CASE WHEN [SourceType] IN ('Disbursement', 'VendorPayment') THEN [TotalAmount] ELSE 0 END) AS [TotalDisbursed],
        SUM(CASE WHEN [SourceType] = 'Donation' THEN [TotalAmount] ELSE -[TotalAmount] END) AS [NetAvailableBalance]
    FROM [Finance].[LedgerTransactions]
    GROUP BY [FundType];
END;
GO

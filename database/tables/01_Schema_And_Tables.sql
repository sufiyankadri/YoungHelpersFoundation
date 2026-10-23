-- ==============================================================================
-- Young Helpers Foundation (YHF) - Complete SQL Server Schema & Procedures
-- Implements YHF Blueprint §10, §11, §12 and docs/database-schema.md
-- ==============================================================================

CREATE SCHEMA [Auth] AUTHORIZATION [dbo];
GO
CREATE SCHEMA [Beneficiary] AUTHORIZATION [dbo];
GO
CREATE SCHEMA [Workflow] AUTHORIZATION [dbo];
GO
CREATE SCHEMA [Cause] AUTHORIZATION [dbo];
GO
CREATE SCHEMA [Donor] AUTHORIZATION [dbo];
GO
CREATE SCHEMA [Finance] AUTHORIZATION [dbo];
GO
CREATE SCHEMA [Rozgaar] AUTHORIZATION [dbo];
GO
CREATE SCHEMA [System] AUTHORIZATION [dbo];
GO

-- 1. Causes Table
CREATE TABLE [Cause].[Causes] (
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID() PRIMARY KEY,
    [Code] VARCHAR(50) NOT NULL UNIQUE,
    [Title] NVARCHAR(250) NOT NULL,
    [Tagline] NVARCHAR(500) NOT NULL,
    [Category] VARCHAR(50) NOT NULL, -- Rozgaar, Medical, Emergency
    [FundType] VARCHAR(50) NOT NULL, -- Zakat, Sadaqah, General
    [TargetAmount] DECIMAL(18,2) NOT NULL CHECK ([TargetAmount] > 0),
    [RaisedAmount] DECIMAL(18,2) NOT NULL DEFAULT 0.00 CHECK ([RaisedAmount] >= 0),
    [DonorCount] INT NOT NULL DEFAULT 0 CHECK ([DonorCount] >= 0),
    [DaysLeft] INT NOT NULL DEFAULT 30,
    [Location] NVARCHAR(150) NOT NULL,
    [VerifiedDate] NVARCHAR(50) NOT NULL,
    [ShariahCompliant] BIT NOT NULL DEFAULT 1,
    [IsUrgent] BIT NOT NULL DEFAULT 0,
    [CoverImage] NVARCHAR(500) NOT NULL,
    [Story] NVARCHAR(MAX) NOT NULL,
    [Status] VARCHAR(50) NOT NULL DEFAULT 'Active', -- Draft, InReview, Active, Funded, Disbursed
    [CreatedAtUtc] DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 2. Rozgaar Micro-Enterprise Plans
CREATE TABLE [Rozgaar].[LivelihoodPlans] (
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID() PRIMARY KEY,
    [CauseId] UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES [Cause].[Causes]([Id]),
    [AssetToolName] NVARCHAR(250) NOT NULL,
    [ExpectedMonthlyIncome] DECIMAL(18,2) NOT NULL CHECK ([ExpectedMonthlyIncome] >= 0),
    [VendorQuotationAmount] DECIMAL(18,2) NOT NULL CHECK ([VendorQuotationAmount] >= 0),
    [VendorPayeeName] NVARCHAR(200) NOT NULL,
    [OwnershipHandoverDate] DATE NULL,
    [Day30MilestoneStatus] NVARCHAR(500) NULL,
    [Day90MilestoneStatus] NVARCHAR(500) NULL,
    [Day180MilestoneStatus] NVARCHAR(500) NULL,
    [CreatedAtUtc] DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 3. Donors Table
CREATE TABLE [Donor].[Donors] (
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID() PRIMARY KEY,
    [Name] NVARCHAR(200) NOT NULL,
    [Phone] NVARCHAR(20) NOT NULL,
    [PanNumber] NVARCHAR(20) NULL,
    [IsAnonymous] BIT NOT NULL DEFAULT 0,
    [CreatedAtUtc] DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 4. Donations Table
CREATE TABLE [Donor].[Donations] (
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID() PRIMARY KEY,
    [ReceiptNumber] VARCHAR(60) NOT NULL UNIQUE,
    [DonorId] UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES [Donor].[Donors]([Id]),
    [CauseId] UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES [Cause].[Causes]([Id]),
    [FundType] VARCHAR(50) NOT NULL, -- Zakat, Sadaqah, General
    [Amount] DECIMAL(18,2) NOT NULL CHECK ([Amount] > 0),
    [PaymentGatewayRef] NVARCHAR(150) NULL,
    [Status] VARCHAR(50) NOT NULL DEFAULT 'Captured', -- Created, Authorized, Captured, Reconciled, Failed
    [CreatedAtUtc] DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 5. Finance Double-Entry Ledger (Blueprint §10)
CREATE TABLE [Finance].[LedgerTransactions] (
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID() PRIMARY KEY,
    [JournalNumber] VARCHAR(60) NOT NULL UNIQUE,
    [EffectiveDate] DATE NOT NULL,
    [FundType] VARCHAR(50) NOT NULL, -- Zakat, Sadaqah, General
    [SourceType] VARCHAR(50) NOT NULL, -- Donation, Disbursement, VendorPayment
    [SourceId] UNIQUEIDENTIFIER NOT NULL,
    [Narrative] NVARCHAR(500) NOT NULL,
    [TotalAmount] DECIMAL(18,2) NOT NULL CHECK ([TotalAmount] > 0),
    [PostedAtUtc] DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE [Finance].[LedgerLines] (
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID() PRIMARY KEY,
    [TransactionId] UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES [Finance].[LedgerTransactions]([Id]),
    [LineNo] INT NOT NULL,
    [AccountCode] VARCHAR(50) NOT NULL, -- e.g. 1010-Bank, 4010-ZakatInflow, 5010-RozgaarAssetExpense
    [Debit] DECIMAL(18,2) NOT NULL DEFAULT 0.00 CHECK ([Debit] >= 0),
    [Credit] DECIMAL(18,2) NOT NULL DEFAULT 0.00 CHECK ([Credit] >= 0),
    CONSTRAINT [CK_LedgerLine_OneSide] CHECK (([Debit] > 0 AND [Credit] = 0) OR ([Credit] > 0 AND [Debit] = 0))
);
GO

-- 6. Beneficiary Applications Intake
CREATE TABLE [Beneficiary].[Applications] (
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID() PRIMARY KEY,
    [TrackingNumber] VARCHAR(50) NOT NULL UNIQUE,
    [Program] VARCHAR(50) NOT NULL, -- Rozgaar, Medical, Emergency
    [FullName] NVARCHAR(200) NOT NULL,
    [Phone] NVARCHAR(20) NOT NULL,
    [City] NVARCHAR(100) NOT NULL,
    [Address] NVARCHAR(500) NOT NULL,
    [DependentsCount] INT NOT NULL DEFAULT 0,
    [MonthlyFamilyIncome] DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    [OccupationSkill] NVARCHAR(250) NOT NULL,
    [HasGovtCard] VARCHAR(50) NOT NULL,
    [NeedDetails] NVARCHAR(MAX) NOT NULL,
    [QuotationAmount] DECIMAL(18,2) NOT NULL CHECK ([QuotationAmount] > 0),
    [ConsentGranted] BIT NOT NULL DEFAULT 1,
    [Status] VARCHAR(50) NOT NULL DEFAULT 'Submitted', -- Submitted, FieldVerificationAssigned, FieldVerified, CommitteeReview, Approved, Rejected
    [AssignedVolunteerId] UNIQUEIDENTIFIER NULL,
    [VerifierNotes] NVARCHAR(MAX) NULL,
    [SubmittedAtUtc] DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

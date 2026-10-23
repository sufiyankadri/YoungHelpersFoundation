namespace YHF.Domain.Entities;

public enum CauseCategory
{
    Rozgaar,
    Medical,
    Emergency
}

public enum FundType
{
    Zakat,
    Sadaqah,
    General
}

public enum CauseStatus
{
    Draft,
    UnderReview,
    Approved,
    Active,
    Funded,
    Disbursed,
    Completed
}

public class Cause
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Tagline { get; set; } = string.Empty;
    public CauseCategory Category { get; set; }
    public FundType FundType { get; set; }
    public decimal TargetAmount { get; set; }
    public decimal RaisedAmount { get; set; }
    public int DonorCount { get; set; }
    public int DaysLeft { get; set; }
    public string Location { get; set; } = string.Empty;
    public string VerifiedDate { get; set; } = string.Empty;
    public bool ShariahCompliant { get; set; } = true;
    public bool IsUrgent { get; set; }
    public string CoverImage { get; set; } = string.Empty;
    public string Story { get; set; } = string.Empty;
    public CauseStatus Status { get; set; } = CauseStatus.Active;

    // Rozgaar Micro-Enterprise plan
    public string? AssetToolName { get; set; }
    public decimal? ExpectedMonthlyIncome { get; set; }
    public string? Day30Status { get; set; }
    public string? Day90Status { get; set; }
    public string? Day180Status { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

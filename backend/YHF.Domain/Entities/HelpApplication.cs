namespace YHF.Domain.Entities;

public enum ApplicationStatus
{
    Submitted,
    FieldVerificationAssigned,
    FieldVerified,
    CommitteeReview,
    Approved,
    Rejected,
    Disbursed
}

public class HelpApplication
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string TrackingNumber { get; set; } = string.Empty;
    public CauseCategory Program { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int DependentsCount { get; set; }
    public decimal MonthlyFamilyIncome { get; set; }
    public string OccupationSkill { get; set; } = string.Empty;
    public string HasGovtCard { get; set; } = string.Empty;
    public string NeedDetails { get; set; } = string.Empty;
    public decimal QuotationAmount { get; set; }
    public bool ConsentGranted { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted;
    public string? VerifierNotes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

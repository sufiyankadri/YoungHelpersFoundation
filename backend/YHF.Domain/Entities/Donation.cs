namespace YHF.Domain.Entities;

public enum DonationStatus
{
    Pending,
    Captured,
    Reconciled,
    Failed,
    Refunded
}

public class Donation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ReceiptNumber { get; set; } = string.Empty;
    public Guid? CauseId { get; set; }
    public Cause? Cause { get; set; }
    public decimal Amount { get; set; }
    public FundType FundType { get; set; }
    public string DonorName { get; set; } = string.Empty;
    public string DonorPhone { get; set; } = string.Empty;
    public string? DonorPan { get; set; }
    public bool IsAnonymous { get; set; }
    public DonationStatus Status { get; set; } = DonationStatus.Captured;
    public string PaymentGatewayRef { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

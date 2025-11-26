namespace CourseVendor.API.Models;

public class Purchase
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public int CourseId { get; set; }
    public string PurchaseCode { get; set; } = string.Empty;
    public decimal AmountPaid { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string? PaypalTransactionId { get; set; }
    public string PaymentStatus { get; set; } = string.Empty;
    public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;
    public bool EmailSent { get; set; } = false;

    // Navigation
    public Customer Customer { get; set; } = null!;
    public Course Course { get; set; } = null!;
}

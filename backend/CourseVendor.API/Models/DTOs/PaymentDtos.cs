namespace CourseVendor.API.Models.DTOs;

public class CourseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal FullPrice { get; set; }
    public decimal DiscountPercentage { get; set; }
    public decimal FinalPrice { get; set; }
}

public class CreateOrderRequest
{
    public int CourseId { get; set; }
    public string CustomerEmail { get; set; } = string.Empty;
    public string? CustomerName { get; set; }
}

public class CreateOrderResponse
{
    public string OrderId { get; set; } = string.Empty;
    public string ApprovalUrl { get; set; } = string.Empty;
}

public class CapturePaymentRequest
{
    public string OrderId { get; set; } = string.Empty;
}

public class CapturePaymentResponse
{
    public bool Success { get; set; }
    public string PurchaseCode { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
}

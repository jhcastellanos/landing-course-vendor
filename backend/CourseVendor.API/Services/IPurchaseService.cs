using CourseVendor.API.Models;

namespace CourseVendor.API.Services;

public interface IPurchaseService
{
    Task<Purchase> CreatePurchaseAsync(int courseId, string customerEmail, string? customerName, string paypalOrderId);
    Task<Purchase?> CompletePurchaseAsync(string paypalOrderId, string transactionId);
    string GeneratePurchaseCode();
}

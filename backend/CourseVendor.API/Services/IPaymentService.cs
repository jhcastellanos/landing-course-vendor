using CourseVendor.API.Models.DTOs;

namespace CourseVendor.API.Services;

public interface IPaymentService
{
    Task<CreateOrderResponse> CreateOrderAsync(int courseId, decimal amount);
    Task<(bool success, string transactionId)> CaptureOrderAsync(string orderId);
}

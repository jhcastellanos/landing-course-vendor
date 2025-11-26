namespace CourseVendor.API.Services;

public interface IEmailService
{
    Task SendCustomerConfirmationAsync(string email, string customerName, string courseName, string purchaseCode);
    Task SendOwnerNotificationAsync(string customerEmail, string customerName, string courseName, decimal amountPaid, string purchaseCode);
}

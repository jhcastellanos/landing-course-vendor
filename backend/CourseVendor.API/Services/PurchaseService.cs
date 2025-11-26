using Microsoft.EntityFrameworkCore;
using CourseVendor.API.Data;
using CourseVendor.API.Models;

namespace CourseVendor.API.Services;

public class PurchaseService : IPurchaseService
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;

    public PurchaseService(AppDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task<Purchase> CreatePurchaseAsync(
        int courseId, 
        string customerEmail, 
        string? customerName,
        string paypalOrderId)
    {
        var course = await _context.Courses.FindAsync(courseId);
        if (course == null)
        {
            throw new InvalidOperationException("Course not found");
        }

        // Find or create customer
        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.Email == customerEmail);

        if (customer == null)
        {
            customer = new Customer
            {
                Email = customerEmail,
                FullName = customerName
            };
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
        }

        // Create purchase
        var purchase = new Purchase
        {
            CustomerId = customer.Id,
            CourseId = courseId,
            PurchaseCode = GeneratePurchaseCode(),
            AmountPaid = course.FinalPrice,
            PaymentMethod = "PayPal",
            PaypalTransactionId = paypalOrderId,
            PaymentStatus = "PENDING"
        };

        _context.Purchases.Add(purchase);
        await _context.SaveChangesAsync();

        return purchase;
    }

    public async Task<Purchase?> CompletePurchaseAsync(string paypalOrderId, string transactionId)
    {
        var purchase = await _context.Purchases
            .Include(p => p.Customer)
            .Include(p => p.Course)
            .FirstOrDefaultAsync(p => p.PaypalTransactionId == paypalOrderId);

        if (purchase == null)
        {
            return null;
        }

        purchase.PaymentStatus = "COMPLETED";
        purchase.PaypalTransactionId = transactionId;
        purchase.EmailSent = true;

        await _context.SaveChangesAsync();

        // Send emails
        try
        {
            await _emailService.SendCustomerConfirmationAsync(
                purchase.Customer.Email,
                purchase.Customer.FullName ?? "Customer",
                purchase.Course.Name,
                purchase.PurchaseCode
            );

            await _emailService.SendOwnerNotificationAsync(
                purchase.Customer.Email,
                purchase.Customer.FullName ?? "Customer",
                purchase.Course.Name,
                purchase.AmountPaid,
                purchase.PurchaseCode
            );
        }
        catch (Exception ex)
        {
            // Log error but don't fail the purchase
            Console.WriteLine($"Email sending failed: {ex.Message}");
        }

        return purchase;
    }

    public string GeneratePurchaseCode()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        var code = new string(Enumerable.Repeat(chars, 12)
            .Select(s => s[random.Next(s.Length)]).ToArray());
        
        return $"CRS-{code}";
    }
}

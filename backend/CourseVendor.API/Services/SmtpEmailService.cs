using System.Net;
using System.Net.Mail;

namespace CourseVendor.API.Services;

public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly SmtpClient _smtpClient;
    private readonly string _fromEmail;
    private readonly string _fromName;

    public SmtpEmailService(IConfiguration configuration)
    {
        _configuration = configuration;
        _fromEmail = _configuration["Email:FromEmail"] ?? "noreply@coursevendor.com";
        _fromName = _configuration["Email:FromName"] ?? "Course Vendor";

        var smtpHost = _configuration["Email:SmtpHost"] ?? "smtp.gmail.com";
        var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
        var smtpUser = _configuration["Email:SmtpUser"] ?? "";
        var smtpPassword = _configuration["Email:SmtpPassword"] ?? "";

        _smtpClient = new SmtpClient(smtpHost)
        {
            Port = smtpPort,
            Credentials = new NetworkCredential(smtpUser, smtpPassword),
            EnableSsl = true,
        };
    }

    public async Task SendCustomerConfirmationAsync(
        string email,
        string customerName,
        string courseName,
        string purchaseCode)
    {
        var subject = "Course Purchase Confirmation";
        
        var body = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
        .content {{ padding: 30px; background: #f9fafb; border-radius: 0 0 8px 8px; }}
        .code-box {{ background: #fff; border: 2px solid #4f46e5; padding: 15px; margin: 20px 0; text-align: center; border-radius: 8px; }}
        .code {{ font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #4f46e5; }}
        .footer {{ padding: 20px; text-align: center; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Thank You for Your Purchase!</h1>
        </div>
        <div class='content'>
            <p>Hi {customerName},</p>
            <p>Thank you for purchasing <strong>{courseName}</strong>!</p>
            <p>Your purchase has been confirmed. Here is your unique purchase code:</p>
            <div class='code-box'>
                <div class='code'>{purchaseCode}</div>
            </div>
            <p>Please save this code for your records.</p>
            <p>Best regards,<br>Course Vendor Team</p>
        </div>
        <div class='footer'>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>";

        var message = new MailMessage(_fromEmail, email, subject, body)
        {
            IsBodyHtml = true
        };

        await _smtpClient.SendMailAsync(message);
    }

    public async Task SendOwnerNotificationAsync(
        string customerEmail,
        string customerName,
        string courseName,
        decimal amountPaid,
        string purchaseCode)
    {
        var ownerEmail = _configuration["Owner:Email"];
        if (string.IsNullOrEmpty(ownerEmail))
        {
            return; // Skip if owner email is not configured
        }

        var subject = "New Course Purchase";
        
        var body = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
        .content {{ padding: 30px; background: #f9fafb; border-radius: 0 0 8px 8px; }}
        .info-row {{ padding: 12px; border-bottom: 1px solid #e5e7eb; }}
        .label {{ font-weight: bold; color: #059669; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>New Purchase Alert</h1>
        </div>
        <div class='content'>
            <h2>A new course has been purchased!</h2>
            <div class='info-row'>
                <span class='label'>Customer Name:</span> {customerName}
            </div>
            <div class='info-row'>
                <span class='label'>Customer Email:</span> {customerEmail}
            </div>
            <div class='info-row'>
                <span class='label'>Course:</span> {courseName}
            </div>
            <div class='info-row'>
                <span class='label'>Amount Paid:</span> ${amountPaid:F2} USD
            </div>
            <div class='info-row'>
                <span class='label'>Purchase Code:</span> {purchaseCode}
            </div>
            <div class='info-row'>
                <span class='label'>Date:</span> {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC
            </div>
        </div>
    </div>
</body>
</html>";

        var message = new MailMessage(_fromEmail, ownerEmail, subject, body)
        {
            IsBodyHtml = true
        };

        await _smtpClient.SendMailAsync(message);
    }
}

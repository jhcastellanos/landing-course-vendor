using SendGrid;
using SendGrid.Helpers.Mail;

namespace CourseVendor.API.Services;

public class SendGridEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly SendGridClient _client;
    private readonly EmailAddress _fromEmail;

    public SendGridEmailService(IConfiguration configuration)
    {
        _configuration = configuration;
        var apiKey = _configuration["SendGrid:ApiKey"];
        
        if (string.IsNullOrEmpty(apiKey))
        {
            throw new InvalidOperationException("SendGrid API key is not configured");
        }

        _client = new SendGridClient(apiKey);
        _fromEmail = new EmailAddress(
            _configuration["SendGrid:FromEmail"],
            _configuration["SendGrid:FromName"]
        );
    }

    public async Task SendCustomerConfirmationAsync(
        string email, 
        string customerName, 
        string courseName, 
        string purchaseCode)
    {
        var to = new EmailAddress(email, customerName);
        var subject = "Course Purchase Confirmation";
        
        var htmlContent = $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: #4f46e5; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background: #f9fafb; }}
                    .code-box {{ background: #fff; border: 2px solid #4f46e5; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; }}
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
                        <div class='code-box'>{purchaseCode}</div>
                        <p>Please save this code for your records. You can use it to access your course materials.</p>
                        <p>If you have any questions, please don't hesitate to contact us.</p>
                        <p>Best regards,<br>Course Vendor Team</p>
                    </div>
                    <div class='footer'>
                        <p>This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        ";

        var msg = MailHelper.CreateSingleEmail(_fromEmail, to, subject, null, htmlContent);
        await _client.SendEmailAsync(msg);
    }

    public async Task SendOwnerNotificationAsync(
        string customerEmail,
        string customerName,
        string courseName,
        decimal amountPaid,
        string purchaseCode)
    {
        var ownerEmail = _configuration["Owner:Email"];
        var ownerName = _configuration["Owner:Name"];

        if (string.IsNullOrEmpty(ownerEmail))
        {
            return; // Skip if owner email is not configured
        }

        var to = new EmailAddress(ownerEmail, ownerName);
        var subject = "New Course Purchase";
        
        var htmlContent = $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: #059669; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background: #f9fafb; }}
                    .info-row {{ padding: 10px; border-bottom: 1px solid #e5e7eb; }}
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
            </html>
        ";

        var msg = MailHelper.CreateSingleEmail(_fromEmail, to, subject, null, htmlContent);
        await _client.SendEmailAsync(msg);
    }
}

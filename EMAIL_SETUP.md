# Email Setup Guide

## Using Gmail SMTP (Recommended for Testing)

Gmail provides free SMTP service that's perfect for forwarding purchase confirmations.

### Step 1: Create an App Password

1. **Enable 2-Step Verification** (if not already enabled):
   - Go to https://myaccount.google.com/security
   - Click on "2-Step Verification"
   - Follow the setup process

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Course Vendor"
   - Click "Generate"
   - **Copy the 16-character password** (you'll use this in configuration)

### Step 2: Configure Backend

Edit `backend/CourseVendor.API/appsettings.json`:

```json
{
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "SmtpUser": "your-gmail@gmail.com",
    "SmtpPassword": "your-16-char-app-password",
    "FromEmail": "your-gmail@gmail.com",
    "FromName": "Your Course Store"
  },
  "Owner": {
    "Email": "your-personal-email@example.com"
  }
}
```

**What happens:**
- Customer receives confirmation at their email
- You receive notification at your personal email
- Both emails are sent from your Gmail account

### Alternative SMTP Providers

#### SendGrid (3,000 emails/month free)
```json
{
  "Email": {
    "SmtpHost": "smtp.sendgrid.net",
    "SmtpPort": "587",
    "SmtpUser": "apikey",
    "SmtpPassword": "your-sendgrid-api-key",
    "FromEmail": "noreply@yourdomain.com",
    "FromName": "Your Course Store"
  }
}
```

#### Mailgun (5,000 emails/month free)
```json
{
  "Email": {
    "SmtpHost": "smtp.mailgun.org",
    "SmtpPort": "587",
    "SmtpUser": "postmaster@your-mailgun-domain",
    "SmtpPassword": "your-mailgun-smtp-password",
    "FromEmail": "noreply@yourdomain.com",
    "FromName": "Your Course Store"
  }
}
```

#### AWS SES (62,000 emails/month free)
```json
{
  "Email": {
    "SmtpHost": "email-smtp.us-east-1.amazonaws.com",
    "SmtpPort": "587",
    "SmtpUser": "your-ses-smtp-username",
    "SmtpPassword": "your-ses-smtp-password",
    "FromEmail": "noreply@yourdomain.com",
    "FromName": "Your Course Store"
  }
}
```

## Email Templates

The system sends two types of emails:

### 1. Customer Confirmation Email
- **To:** Customer's email address
- **Subject:** Course Purchase Confirmation
- **Contains:**
  - Course name
  - Purchase code (unique identifier)
  - Professional HTML template

### 2. Owner Notification Email
- **To:** Your personal email (configured in `Owner:Email`)
- **Subject:** New Course Purchase
- **Contains:**
  - Customer email
  - Course purchased
  - Purchase code
  - Purchase timestamp

## Testing Email Configuration

### Test 1: Check SMTP Connection

Run this in the backend directory:

```bash
dotnet run
```

Check the logs for any SMTP errors.

### Test 2: Make a Test Purchase

1. Start the backend and frontend
2. Make a test purchase using PayPal sandbox
3. Check both inboxes:
   - Customer email should receive confirmation
   - Your personal email should receive notification

### Troubleshooting

#### "Authentication failed" Error
- ✅ Verify you're using an App Password (not regular password)
- ✅ Check 2-Step Verification is enabled
- ✅ Ensure SmtpUser matches the Gmail account

#### Emails Not Arriving
- ✅ Check spam/junk folders
- ✅ Verify `Owner:Email` is correctly configured
- ✅ Check backend logs for errors
- ✅ Test SMTP credentials with an email client

#### Gmail Blocking Emails
- ✅ Enable "Less secure app access" if using old Gmail accounts
- ✅ Use App Passwords instead of regular passwords
- ✅ Check Gmail "Sent" folder to verify emails are being sent

## Production Recommendations

For production use:

1. **Use a dedicated email service:**
   - SendGrid, Mailgun, or AWS SES
   - Better deliverability rates
   - Analytics and tracking
   - Higher sending limits

2. **Use a custom domain:**
   - Example: `noreply@yourstore.com`
   - More professional appearance
   - Better spam score

3. **Implement email templates:**
   - Already included in `SmtpEmailService.cs`
   - Customize HTML templates as needed

4. **Add email logging:**
   - Track sent emails in database
   - Monitor delivery success rates
   - Debug customer issues

## Cost Comparison

| Provider | Free Tier | Cost After Free Tier |
|----------|-----------|---------------------|
| Gmail | ~100/day | Not for commercial use |
| SendGrid | 3,000/month | $19.95/mo (50K emails) |
| Mailgun | 5,000/month | $35/mo (50K emails) |
| AWS SES | 62,000/month | $0.10 per 1,000 emails |

**Recommendation:** Start with Gmail for testing, switch to AWS SES or SendGrid for production.

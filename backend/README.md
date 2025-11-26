# Backend Setup Guide

## Prerequisites

- .NET 8.0 SDK installed
- PostgreSQL database (Neon account recommended)
- PayPal Developer account
- SendGrid account (or SMTP credentials)

## Installation Steps

### 1. Navigate to Backend Directory

```bash
cd backend/CourseVendor.API
```

### 2. Restore NuGet Packages

```bash
dotnet restore
```

### 3. Database Setup (Neon PostgreSQL)

#### Create a Neon Account
1. Visit [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy the connection string

#### Run Database Schema
1. Connect to your Neon database using psql or a GUI tool
2. Run the SQL script from `database/schema.sql`

```bash
# Using psql (replace with your connection string)
psql "postgresql://user:password@hostname/database?sslmode=require" -f ../../database/schema.sql
```

### 4. Configure Application Settings

Edit `appsettings.json` with your credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=your-neon-host;Database=neondb;Username=your-user;Password=your-password;SSL Mode=Require"
  },
  "PayPal": {
    "Mode": "sandbox",
    "ClientId": "YOUR_PAYPAL_CLIENT_ID",
    "ClientSecret": "YOUR_PAYPAL_CLIENT_SECRET"
  },
  "SendGrid": {
    "ApiKey": "YOUR_SENDGRID_API_KEY",
    "FromEmail": "noreply@yourcompany.com",
    "FromName": "Course Vendor"
  },
  "Owner": {
    "Email": "your-email@example.com",
    "Name": "Your Name"
  },
  "Frontend": {
    "Url": "http://localhost:3000"
  }
}
```

### 5. PayPal Configuration

#### Get PayPal Credentials
1. Go to [https://developer.paypal.com](https://developer.paypal.com)
2. Log in to Dashboard
3. Go to **Apps & Credentials**
4. Create a new app (or use existing)
5. Copy **Client ID** and **Secret**
6. Use **Sandbox** mode for testing

#### For Production
- Change `Mode` to `"live"`
- Use production credentials
- Submit app for review if needed

### 6. SendGrid Configuration

#### Get SendGrid API Key
1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Create an API Key
3. Verify sender email address
4. Copy API key to `appsettings.json`

### 7. Run the Application

```bash
# Development mode with hot reload
dotnet watch run

# Or regular run
dotnet run
```

The API will be available at: **http://localhost:5000**

Swagger documentation: **http://localhost:5000/swagger**

## API Endpoints

### Courses
- `GET /api/courses` - Get all active courses
- `GET /api/courses/{id}` - Get specific course

### Payments
- `POST /api/payment/create-order` - Create PayPal order
  ```json
  {
    "courseId": 1,
    "customerEmail": "customer@example.com",
    "customerName": "John Doe"
  }
  ```

- `POST /api/payment/capture-order` - Capture payment
  ```json
  {
    "orderId": "PAYPAL_ORDER_ID"
  }
  ```

## Database Migrations

If you make changes to models, run:

```bash
# Create migration
dotnet ef migrations add MigrationName

# Apply migration
dotnet ef database update
```

## Troubleshooting

### Connection Issues
- Ensure Neon database is accessible
- Check SSL mode in connection string
- Verify firewall/network settings

### PayPal Errors
- Verify Client ID and Secret are correct
- Check sandbox vs live mode
- Ensure return URLs are correct

### Email Not Sending
- Verify SendGrid API key
- Check sender email is verified
- Review SendGrid activity log

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

# PayPal Sandbox Testing Guide

## Testing Payment Options

You have PayPal Sandbox configured, which allows you to test payments with fake money and accounts.

---

## Option 1: Test with PayPal Account (Recommended)

### Get Your Test PayPal Accounts

1. Go to https://developer.paypal.com/
2. Log in to your PayPal Developer account
3. Navigate to **Sandbox** → **Accounts** (in the left menu)
4. You should see automatically created test accounts:
   - **Business Account** (Merchant - receives money)
   - **Personal Account** (Buyer - sends money)

5. Click on the **Personal Account** (the buyer account)
6. Click the **"..."** (three dots) menu and select **"View/Edit account"**
7. You'll see:
   - **Email**: Something like `sb-xxxxx@personal.example.com`
   - **Password**: Click "Show" to reveal it (or you can set a new one)

### How to Test

1. On your website, click **"Buy Course"**
2. Enter any email address (your real email is fine - confirmations go to sandbox)
3. Click the **"PayPal"** button
4. A PayPal popup will open
5. **Log in using the Personal Test Account credentials** from step 7 above
6. Complete the payment - it uses fake money ($10,000 in the account)
7. You'll be redirected back and see the success message!

---

## Option 2: Test with Debit Card

PayPal Sandbox provides test card numbers:

### Test Card Numbers (All Valid for Sandbox)

**Visa:**
```
Card Number: 4032039683256375
Expiry: Any future date (e.g., 12/2025)
CVV: Any 3 digits (e.g., 123)
```

**Mastercard:**
```
Card Number: 5425233430109903
Expiry: Any future date (e.g., 12/2025)
CVV: Any 3 digits (e.g., 123)
```

**American Express:**
```
Card Number: 374245455400001
Expiry: Any future date (e.g., 12/2025)
CVV: Any 4 digits (e.g., 1234)
```

### How to Test with Card

1. Click **"Buy Course"**
2. Enter your email
3. Click the **"Debit or Credit Card"** button (if visible)
4. Enter one of the test card numbers above
5. Use any future expiry date
6. Use any CVV (123 for Visa/MC, 1234 for Amex)
7. Complete the payment

---

## What Happens After Payment?

1. ✅ Payment is processed in PayPal Sandbox
2. ✅ You receive a unique purchase code
3. ✅ Email confirmation is sent (to sandbox, won't reach real inbox yet)
4. ✅ Purchase is recorded in the database
5. ✅ You can view the purchase in the Admin Panel

---

## Checking Test Payments

### In PayPal Sandbox:
1. Go to https://developer.paypal.com/
2. Navigate to **Sandbox** → **Accounts**
3. Click on your **Business Account** (merchant)
4. Click **"View/Edit"** → **"PayPal Balance"**
5. You'll see the test payment received!

### In Your Admin Panel:
1. Go to http://localhost:3000/admin/login
2. Login with: `jhcastellanos` / `Ruudvan123*`
3. View all purchases in the dashboard

---

## Important Notes

- 🔒 **Everything is in Sandbox** - No real money is involved
- 💰 Test accounts have **fake $10,000 balance**
- 📧 Emails go to sandbox (won't reach real email until you configure SMTP)
- 🧪 Test cards work only in Sandbox mode
- 🚀 When ready for production, switch `Mode: "sandbox"` to `"live"` in appsettings.json

---

## Troubleshooting

**Can't see card option?**
- The card option appears in the PayPal popup after clicking "PayPal"
- Or use the debit card button if available

**Payment fails?**
- Check browser console (F12) for errors
- Verify PayPal credentials are correct
- Make sure backend server is running on port 5000

**Want to see email confirmations?**
- Configure SMTP settings in appsettings.json
- Use Gmail App Password for testing
- See EMAIL_SETUP.md for details

---

## Quick Test Checklist

✅ Backend running on http://localhost:5000
✅ Frontend running on http://localhost:3000
✅ PayPal ClientId configured
✅ PayPal ClientSecret configured
✅ Use sandbox test accounts or test cards
✅ Check Admin Panel for purchase records

Happy Testing! 🎉

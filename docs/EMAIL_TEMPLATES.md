# Supabase Email Templates for Bite Buddy

Configure these templates in your Supabase Dashboard:
**Authentication → Email Templates**

---

## 1. Confirm Signup (Email Verification)

### Subject
```
Welcome to Bite Buddy - Verify Your Email
```

### Body (HTML)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #1f2937;
      font-size: 22px;
      margin-top: 0;
    }
    .content p {
      color: #4b5563;
      font-size: 16px;
      margin: 16px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
    }
    .button:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      color: #6b7280;
      font-size: 14px;
      margin: 8px 0;
    }
    .footer a {
      color: #10b981;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🍽️ Bite Buddy</h1>
    </div>

    <div class="content">
      <h2>Welcome to Bite Buddy!</h2>

      <p>Hi there! 👋</p>

      <p>We're excited to have you join our community of food lovers. To get started, please verify your email address by clicking the button below:</p>

      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Verify Email Address</a>
      </div>

      <p>Once verified, you'll be able to:</p>
      <ul style="color: #4b5563; font-size: 16px;">
        <li>Save your favorite recipes</li>
        <li>Create personalized meal plans</li>
        <li>Generate AI-powered recipes</li>
        <li>Track your ingredients and nutrition</li>
      </ul>

      <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
        If you didn't create an account with Bite Buddy, you can safely ignore this email.
      </p>

      <p style="color: #6b7280; font-size: 14px;">
        This link will expire in 24 hours.
      </p>
    </div>

    <div class="footer">
      <p>
        <strong>Bite Buddy</strong><br>
        Your AI-Powered Recipe Companion
      </p>
      <p>
        <a href="https://bitebuddy.co.uk">Visit Website</a> •
        <a href="https://bitebuddy.co.uk/about">About Us</a> •
        <a href="https://bitebuddy.co.uk/contact">Contact</a>
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">
        © {{ .CurrentYear }} Bite Buddy. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 2. Reset Password

### Subject
```
Reset Your Bite Buddy Password
```

### Body (HTML)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #1f2937;
      font-size: 22px;
      margin-top: 0;
    }
    .content p {
      color: #4b5563;
      font-size: 16px;
      margin: 16px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
    }
    .button:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }
    .alert {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .alert p {
      margin: 0;
      color: #92400e;
      font-size: 14px;
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      color: #6b7280;
      font-size: 14px;
      margin: 8px 0;
    }
    .footer a {
      color: #10b981;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Password Reset</h1>
    </div>

    <div class="content">
      <h2>Reset Your Password</h2>

      <p>Hi there,</p>

      <p>We received a request to reset the password for your Bite Buddy account. Click the button below to create a new password:</p>

      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
      </div>

      <div class="alert">
        <p><strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
      </div>

      <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
        This link will expire in 1 hour for security reasons.
      </p>

      <p style="color: #6b7280; font-size: 14px;">
        For security purposes, this reset link can only be used once.
      </p>
    </div>

    <div class="footer">
      <p>
        <strong>Bite Buddy</strong><br>
        Your AI-Powered Recipe Companion
      </p>
      <p>
        <a href="https://bitebuddy.co.uk">Visit Website</a> •
        <a href="https://bitebuddy.co.uk/contact">Contact Support</a>
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">
        © {{ .CurrentYear }} Bite Buddy. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 3. Email Change Confirmation

### Subject
```
Confirm Your Email Change - Bite Buddy
```

### Body (HTML)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #1f2937;
      font-size: 22px;
      margin-top: 0;
    }
    .content p {
      color: #4b5563;
      font-size: 16px;
      margin: 16px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
    }
    .button:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }
    .alert {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .alert p {
      margin: 0;
      color: #92400e;
      font-size: 14px;
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      color: #6b7280;
      font-size: 14px;
      margin: 8px 0;
    }
    .footer a {
      color: #10b981;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✉️ Email Change</h1>
    </div>

    <div class="content">
      <h2>Confirm Your New Email</h2>

      <p>Hi there,</p>

      <p>We received a request to change the email address associated with your Bite Buddy account. To confirm this change, please click the button below:</p>

      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Confirm Email Change</a>
      </div>

      <div class="alert">
        <p><strong>⚠️ Security Notice:</strong> If you didn't request this email change, please contact our support team immediately and change your password.</p>
      </div>

      <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
        This link will expire in 24 hours.
      </p>
    </div>

    <div class="footer">
      <p>
        <strong>Bite Buddy</strong><br>
        Your AI-Powered Recipe Companion
      </p>
      <p>
        <a href="https://bitebuddy.co.uk">Visit Website</a> •
        <a href="https://bitebuddy.co.uk/contact">Contact Support</a>
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">
        © {{ .CurrentYear }} Bite Buddy. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 4. Invite User (Optional - for team features)

### Subject
```
You've Been Invited to Bite Buddy
```

### Body (HTML)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #1f2937;
      font-size: 22px;
      margin-top: 0;
    }
    .content p {
      color: #4b5563;
      font-size: 16px;
      margin: 16px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
    }
    .button:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      color: #6b7280;
      font-size: 14px;
      margin: 8px 0;
    }
    .footer a {
      color: #10b981;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 You're Invited!</h1>
    </div>

    <div class="content">
      <h2>Join Bite Buddy</h2>

      <p>Hi there!</p>

      <p>You've been invited to join Bite Buddy, the AI-powered recipe companion that makes cooking easier and more enjoyable.</p>

      <p>Click the button below to accept your invitation and create your account:</p>

      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Accept Invitation</a>
      </div>

      <p>With Bite Buddy, you can:</p>
      <ul style="color: #4b5563; font-size: 16px;">
        <li>Discover thousands of delicious recipes</li>
        <li>Save and organize your favorites</li>
        <li>Create personalized meal plans</li>
        <li>Generate custom AI recipes based on your ingredients</li>
        <li>Track nutrition and dietary preferences</li>
      </ul>

      <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
        This invitation will expire in 7 days.
      </p>
    </div>

    <div class="footer">
      <p>
        <strong>Bite Buddy</strong><br>
        Your AI-Powered Recipe Companion
      </p>
      <p>
        <a href="https://bitebuddy.co.uk">Visit Website</a> •
        <a href="https://bitebuddy.co.uk/about">About Us</a>
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">
        © {{ .CurrentYear }} Bite Buddy. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
```

---

## How to Apply These Templates

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Click **Authentication** in the sidebar
   - Click **Email Templates**

2. **For Each Template:**
   - Select the template type (Confirm signup, Reset password, etc.)
   - Replace the subject line
   - Replace the HTML body with the corresponding template above
   - Click **Save**

3. **Available Variables:**
   Supabase provides these template variables:
   - `{{ .ConfirmationURL }}` - The action link (verify, reset, etc.)
   - `{{ .Email }}` - Recipient's email address
   - `{{ .Token }}` - Confirmation token
   - `{{ .TokenHash }}` - Hashed token
   - `{{ .SiteURL }}` - Your site URL from Supabase config
   - `{{ .CurrentYear }}` - Current year (custom, may need manual update)

4. **Testing:**
   - Use the "Send test email" feature in Supabase
   - Check spam folder if emails don't arrive
   - Verify all links work correctly

5. **Customization:**
   - Replace `bitebuddy.co.uk` with your actual domain
   - Adjust colors to match your brand (currently using emerald/green)
   - Add your logo by inserting an `<img>` tag in the header
   - Modify copy to match your brand voice

---

## Text-Only Versions (Fallback)

For email clients that don't support HTML, here are plain text versions:

### Confirm Signup (Text)
```
Welcome to Bite Buddy!

Hi there,

Thanks for signing up! Please verify your email address by clicking the link below:

{{ .ConfirmationURL }}

Once verified, you'll be able to save recipes, create meal plans, and generate AI-powered recipes.

This link expires in 24 hours.

If you didn't create an account, you can safely ignore this email.

—
Bite Buddy
https://bitebuddy.co.uk
```

### Reset Password (Text)
```
Reset Your Password

Hi there,

We received a request to reset your Bite Buddy password. Click the link below to create a new password:

{{ .ConfirmationURL }}

If you didn't request this, ignore this email - your password will remain unchanged.

This link expires in 1 hour.

—
Bite Buddy
https://bitebuddy.co.uk
```


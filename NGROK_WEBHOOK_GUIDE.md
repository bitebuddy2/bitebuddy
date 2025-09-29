# Using ngrok for Webhook Development

Since Sanity webhooks can't call localhost URLs, we need to use ngrok to create a secure tunnel that exposes your local development server to the internet.

## Quick Setup (2 Steps)

### Step 1: Start Your Development Server
```bash
npm run dev
```
Keep this running in one terminal.

### Step 2: Start ngrok Tunnel

**Option A: Using the batch file (Windows)**
```bash
# Double-click or run:
start-ngrok.bat
```

**Option B: Using PowerShell**
```powershell
.\start-ngrok.ps1
```

**Option C: Direct command**
```bash
ngrok http 3000
```

## Get Your ngrok URL

Once ngrok starts, you'll see output like this:
```
ngrok

Session Status                online
Account                       your-account (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://1234-56-78-90-123.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Copy the HTTPS URL** (e.g., `https://1234-56-78-90-123.ngrok-free.app`)

## Configure Sanity Webhooks

Now go to [Sanity Dashboard](https://www.sanity.io/manage) and create your webhooks with these URLs:

### Recipe Webhook
- **Name**: `Nutrition Recalc - Recipe Changes`
- **URL**: `https://YOUR-NGROK-URL.ngrok-free.app/api/recalc-nutrition?secret=nutrition-webhook-secret-2024`
- **Filter**: `_type == "recipe"`
- **Method**: `POST`

### Ingredient Webhook
- **Name**: `Nutrition Recalc - Ingredient Changes`
- **URL**: `https://YOUR-NGROK-URL.ngrok-free.app/api/recalc-nutrition/ingredient-changed?secret=nutrition-webhook-secret-2024`
- **Filter**: `_type == "ingredient"`
- **Method**: `POST`

## Testing

1. **Edit a recipe** in Sanity Studio
2. **Check your terminal** where `npm run dev` is running - you should see webhook activity
3. **Verify nutrition was updated** in the recipe

## Important Notes

- **Keep ngrok running** while testing webhooks
- **The ngrok URL changes** each time you restart (unless you have a paid plan)
- **Update webhook URLs** in Sanity Dashboard if you restart ngrok
- **Monitor the ngrok web interface** at http://127.0.0.1:4040 to see webhook traffic

## Troubleshooting

### Webhook Not Firing
1. Check that ngrok is still running
2. Verify the URL is correct in Sanity Dashboard
3. Make sure your dev server (`npm run dev`) is running

### "Warning: You are using ngrok-free.app..."
This is normal for free ngrok accounts. Click "Visit Site" to proceed.

### Getting 404 Errors
1. Ensure your dev server is running on port 3000
2. Test your local endpoint first: `npm run test-nutrition auto`
3. Check that the ngrok URL is forwarding to localhost:3000

## Next Steps

Once your webhooks are working in development:
1. Deploy your app to production (Vercel, etc.)
2. Update webhook URLs to use your production domain
3. Remove ngrok (no longer needed for production)
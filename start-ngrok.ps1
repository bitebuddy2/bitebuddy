# PowerShell script to start ngrok tunnel
Write-Host "Starting ngrok tunnel for BiteBuddy webhooks..." -ForegroundColor Green
Write-Host "This will expose your localhost:3000 to the internet for Sanity webhooks" -ForegroundColor Yellow
Write-Host ""

# Start ngrok
Start-Process -FilePath "ngrok" -ArgumentList "http", "3000" -Wait
Write-Host "Generating self-signed SSL certificates..." -ForegroundColor Cyan

if (-not (Test-Path "certs")) {
    New-Item -ItemType Directory -Path "certs" -Force | Out-Null
}

Write-Host "Run this command manually (requires OpenSSL):" -ForegroundColor Yellow
Write-Host ""
Write-Host "openssl req -nodes -new -x509 -keyout certs/key.pem -out certs/cert.pem -days 365 -subj `"/C=US/ST=State/L=City/O=Development/CN=localhost`"" -ForegroundColor White
Write-Host ""
Write-Host "Or use PowerShell to create self-signed cert:" -ForegroundColor Yellow
Write-Host ""

 $cert = New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation "cert:\LocalMachine\My" -NotAfter (Get-Date).AddYears(1)
 $pwd = ConvertTo-SecureString -String "password" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "certs/certificate.pfx" -Password $pwd

Write-Host "Certificate created: certs/certificate.pfx" -ForegroundColor Green
Write-Host "WARNING: For development only!" -ForegroundColor Red
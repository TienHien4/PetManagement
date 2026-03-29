# Test Year-End Sale Email Campaign

Write-Host "Testing Year-End Sale Email Campaign..." -ForegroundColor Cyan
Write-Host ""

# Test endpoint
$url = "http://localhost:8080/api/email-test/year-end-sale"

Write-Host "Calling: $url" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing
    
    Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response Body:" -ForegroundColor Green
    Write-Host $response.Content
    Write-Host ""
    Write-Host "✓ Email campaign triggered successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Check your IntelliJ console for email processing logs..." -ForegroundColor Yellow
    Write-Host "Check Kafka topics:" -ForegroundColor Yellow
    Write-Host "  docker exec -it petcare-kafka kafka-topics --bootstrap-server localhost:9092 --list" -ForegroundColor Gray
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Error Status: $statusCode" -ForegroundColor Red
    
    if ($statusCode -eq 401) {
        Write-Host "Need authentication. Trying to get token..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Please login first and run this script with authorization token" -ForegroundColor Yellow
    } else {
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

param(
    [string]$ProjectId = "ANIMEMIN",
    [string]$Region = "us-central1",
    [string]$ServiceName = "consumet-api"
)

Write-Host "Starting deploy script with ProjectId=$ProjectId, Region=$Region, ServiceName=$ServiceName"

if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Error "gcloud CLI not found. Install Google Cloud SDK and run 'gcloud auth login' first."; exit 1
}
if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
    Write-Error "firebase CLI not found. Install with 'npm install -g firebase-tools' and run 'firebase login'."; exit 1
}

# Build and push backend container
$backendPath = Join-Path $PSScriptRoot "api.consumet.org-main"
if (-not (Test-Path $backendPath)) { Write-Error "Backend folder not found: $backendPath"; exit 1 }

Write-Host "Building and submitting container to Google Cloud Build..."
Push-Location $backendPath
try {
    gcloud builds submit --tag "gcr.io/$ProjectId/$ServiceName"
} catch {
    Write-Error "gcloud builds submit failed: $_"; Pop-Location; exit 1
}
Pop-Location

Write-Host "Deploying to Cloud Run..."
gcloud run deploy $ServiceName --image "gcr.io/$ProjectId/$ServiceName" --platform managed --region $Region --allow-unauthenticated --port 3000

# Get service URL
$serviceUrl = gcloud run services describe $ServiceName --platform managed --region $Region --format "value(status.url)"
Write-Host "Cloud Run service URL: $serviceUrl"

# Build frontend
$frontendPath = Join-Path $PSScriptRoot "anime-react-app"
if (-not (Test-Path $frontendPath)) { Write-Error "Frontend folder not found: $frontendPath"; exit 1 }

Write-Host "Building frontend (Vite)..."
Push-Location $frontendPath
try {
    npm install
    npm run build
} catch {
    Write-Error "Frontend build failed: $_"; Pop-Location; exit 1
}
Pop-Location

# Deploy hosting (assumes firebase project already initialized and linked to the same GCP project)
Write-Host "Deploying Firebase Hosting..."
Push-Location $frontendPath
try {
    firebase deploy --only hosting
} catch {
    Write-Error "Firebase deploy failed: $_"; Pop-Location; exit 1
}
Pop-Location

Write-Host "Deployment finished. Frontend should be available on your Firebase Hosting URL. API endpoint (Cloud Run): $serviceUrl"

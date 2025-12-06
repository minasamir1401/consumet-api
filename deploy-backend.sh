#!/bin/bash
# Backend deployment script for Cloud Shell

set -e

PROJECT_ID="${1:-trans-invention-443716-q4}"
REGION="${2:-us-central1}"
SERVICE_NAME="${3:-consumet-api}"

echo "Deploying backend to Cloud Run..."
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "Service Name: $SERVICE_NAME"

# Set project
gcloud config set project "$PROJECT_ID"

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and push container
echo "Building and pushing container image..."
cd api.consumet.org-main
gcloud builds submit --tag "gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "gcr.io/$PROJECT_ID/$SERVICE_NAME" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 3600

# Get service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --platform managed --region "$REGION" --format "value(status.url)")

echo ""
echo "✓ Backend deployment complete!"
echo "Service URL: $SERVICE_URL"
echo ""
echo "To add this as API rewrite in Firebase Hosting, update anime-react-app/firebase.json:"
echo '  { "source": "/api/**", "run": { "serviceId": "'$SERVICE_NAME'", "region": "'$REGION'" } }'
echo ""
echo "Then run: firebase deploy --only hosting"

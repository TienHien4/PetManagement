# Pet Management Kubernetes Deployment Script (PowerShell)
# Usage: .\deploy.ps1 [install|update|delete|status]

param(
    [Parameter(Position=0)]
    [ValidateSet('install','update','delete','status','logs')]
    [string]$Command,
    
    [Parameter(Position=1)]
    [string]$Service
)

$NAMESPACE = "pet-management"
$K8S_DIR = "k8s"

function Write-Step {
    param([string]$Message)
    Write-Host "==> $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "ERROR: $Message" -ForegroundColor Red
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "WARNING: $Message" -ForegroundColor Yellow
}

function Check-Prerequisites {
    Write-Step "Checking prerequisites..."
    
    if (!(Get-Command kubectl -ErrorAction SilentlyContinue)) {
        Write-Error-Custom "kubectl is not installed"
        exit 1
    }
    
    try {
        kubectl cluster-info | Out-Null
    } catch {
        Write-Error-Custom "Cannot connect to Kubernetes cluster"
        exit 1
    }
    
    Write-Step "Prerequisites check passed"
}

function Install-PetManagement {
    Write-Step "Starting Pet Management deployment..."
    
    # Create namespace
    Write-Step "Creating namespace..."
    kubectl apply -f "$K8S_DIR/namespace.yaml"
    
    # Deploy secrets and configmaps
    Write-Step "Deploying secrets and configmaps..."
    kubectl apply -f "$K8S_DIR/mysql-secret.yaml"
    kubectl apply -f "$K8S_DIR/mysql-configmap.yaml"
    kubectl apply -f "$K8S_DIR/backend-configmap.yaml"
    
    # Deploy persistent volumes
    Write-Step "Creating persistent volumes..."
    kubectl apply -f "$K8S_DIR/mysql-pvc.yaml"
    
    # Deploy MySQL
    Write-Step "Deploying MySQL..."
    kubectl apply -f "$K8S_DIR/mysql-deployment.yaml"
    Write-Step "Waiting for MySQL to be ready..."
    kubectl wait --for=condition=ready pod -l app=mysql -n $NAMESPACE --timeout=300s
    
    # Deploy Kafka
    Write-Step "Deploying Kafka..."
    kubectl apply -f "$K8S_DIR/kafka-deployment.yaml"
    Write-Step "Waiting for Kafka to be ready..."
    kubectl wait --for=condition=ready pod -l app=kafka -n $NAMESPACE --timeout=300s
    
    # Deploy Backend
    Write-Step "Deploying Backend..."
    kubectl apply -f "$K8S_DIR/backend-deployment.yaml"
    Write-Step "Waiting for Backend to be ready..."
    kubectl wait --for=condition=ready pod -l app=backend -n $NAMESPACE --timeout=300s
    
    # Deploy Frontend
    Write-Step "Deploying Frontend..."
    kubectl apply -f "$K8S_DIR/frontend-deployment.yaml"
    
    # Deploy Ingress
    Write-Step "Deploying Ingress..."
    kubectl apply -f "$K8S_DIR/ingress.yaml"
    
    # Deploy HPA
    Write-Step "Deploying Horizontal Pod Autoscaler..."
    try {
        kubectl apply -f "$K8S_DIR/hpa.yaml"
    } catch {
        Write-Warning-Custom "HPA deployment failed (metrics-server might not be installed)"
    }
    
    Write-Step "Deployment completed successfully!"
    Get-Status
}

function Update-PetManagement {
    Write-Step "Updating Pet Management deployment..."
    
    # Update ConfigMaps and Secrets
    kubectl apply -f "$K8S_DIR/mysql-secret.yaml"
    kubectl apply -f "$K8S_DIR/mysql-configmap.yaml"
    kubectl apply -f "$K8S_DIR/backend-configmap.yaml"
    
    # Update deployments
    kubectl apply -f "$K8S_DIR/backend-deployment.yaml"
    kubectl apply -f "$K8S_DIR/frontend-deployment.yaml"
    kubectl apply -f "$K8S_DIR/ingress.yaml"
    
    try {
        kubectl apply -f "$K8S_DIR/hpa.yaml"
    } catch {
        Write-Warning-Custom "HPA update failed"
    }
    
    # Restart deployments to pick up changes
    kubectl rollout restart deployment/backend -n $NAMESPACE
    kubectl rollout restart deployment/frontend -n $NAMESPACE
    
    Write-Step "Update completed!"
}

function Remove-PetManagement {
    Write-Warning-Custom "This will delete all Pet Management resources!"
    $confirm = Read-Host "Are you sure? (yes/no)"
    
    if ($confirm -ne "yes") {
        Write-Step "Deletion cancelled"
        return
    }
    
    Write-Step "Deleting Pet Management deployment..."
    kubectl delete namespace $NAMESPACE
    Write-Step "Deletion completed"
}

function Get-Status {
    Write-Step "Current deployment status:"
    Write-Host ""
    Write-Host "=== Pods ===" -ForegroundColor Cyan
    kubectl get pods -n $NAMESPACE
    Write-Host ""
    Write-Host "=== Services ===" -ForegroundColor Cyan
    kubectl get svc -n $NAMESPACE
    Write-Host ""
    Write-Host "=== Ingress ===" -ForegroundColor Cyan
    kubectl get ingress -n $NAMESPACE
    Write-Host ""
    Write-Host "=== HPA ===" -ForegroundColor Cyan
    try {
        kubectl get hpa -n $NAMESPACE
    } catch {
        Write-Warning-Custom "HPA not available"
    }
    Write-Host ""
    
    # Get Ingress URL
    try {
        $INGRESS_IP = kubectl get ingress pet-management-ingress -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
        if ($INGRESS_IP) {
            Write-Step "Application URL: http://$INGRESS_IP"
        } else {
            Write-Warning-Custom "Ingress IP not yet assigned"
        }
    } catch {
        Write-Warning-Custom "Could not get Ingress IP"
    }
}

function Get-Logs {
    param([string]$ServiceName)
    
    if ([string]::IsNullOrEmpty($ServiceName)) {
        Write-Error-Custom "Please specify a service (backend|frontend|mysql|kafka)"
        exit 1
    }
    
    switch ($ServiceName) {
        "backend" {
            kubectl logs -f deployment/backend -n $NAMESPACE
        }
        "frontend" {
            kubectl logs -f deployment/frontend -n $NAMESPACE
        }
        "mysql" {
            kubectl logs -f statefulset/mysql -n $NAMESPACE
        }
        "kafka" {
            kubectl logs -f statefulset/kafka -n $NAMESPACE
        }
        default {
            Write-Error-Custom "Unknown service: $ServiceName"
            exit 1
        }
    }
}

# Main script logic
if ([string]::IsNullOrEmpty($Command)) {
    Write-Host "Usage: .\deploy.ps1 [install|update|delete|status|logs]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  install  - Deploy Pet Management to Kubernetes"
    Write-Host "  update   - Update existing deployment"
    Write-Host "  delete   - Remove all resources"
    Write-Host "  status   - Show deployment status"
    Write-Host "  logs     - Show logs for a service (backend|frontend|mysql|kafka)"
    exit 1
}

switch ($Command) {
    "install" {
        Check-Prerequisites
        Install-PetManagement
    }
    "update" {
        Check-Prerequisites
        Update-PetManagement
    }
    "delete" {
        Remove-PetManagement
    }
    "status" {
        Get-Status
    }
    "logs" {
        Get-Logs -ServiceName $Service
    }
}

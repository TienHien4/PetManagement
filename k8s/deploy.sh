#!/bin/bash

# Pet Management Kubernetes Deployment Script
# Usage: ./deploy.sh [install|update|delete|status]

set -e

NAMESPACE="pet-management"
K8S_DIR="k8s"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${GREEN}==>${NC} $1"
}

print_error() {
    echo -e "${RED}ERROR:${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}WARNING:${NC} $1"
}

check_prerequisites() {
    print_step "Checking prerequisites..."
    
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed"
        exit 1
    fi
    
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    
    print_step "Prerequisites check passed"
}

install() {
    print_step "Starting Pet Management deployment..."
    
    # Create namespace
    print_step "Creating namespace..."
    kubectl apply -f $K8S_DIR/namespace.yaml
    
    # Deploy secrets and configmaps
    print_step "Deploying secrets and configmaps..."
    kubectl apply -f $K8S_DIR/mysql-secret.yaml
    kubectl apply -f $K8S_DIR/mysql-configmap.yaml
    kubectl apply -f $K8S_DIR/backend-configmap.yaml
    
    # Deploy persistent volumes
    print_step "Creating persistent volumes..."
    kubectl apply -f $K8S_DIR/mysql-pvc.yaml
    
    # Deploy MySQL
    print_step "Deploying MySQL..."
    kubectl apply -f $K8S_DIR/mysql-deployment.yaml
    print_step "Waiting for MySQL to be ready..."
    kubectl wait --for=condition=ready pod -l app=mysql -n $NAMESPACE --timeout=300s
    
    # Deploy Kafka
    print_step "Deploying Kafka..."
    kubectl apply -f $K8S_DIR/kafka-deployment.yaml
    print_step "Waiting for Kafka to be ready..."
    kubectl wait --for=condition=ready pod -l app=kafka -n $NAMESPACE --timeout=300s
    
    # Deploy Backend
    print_step "Deploying Backend..."
    kubectl apply -f $K8S_DIR/backend-deployment.yaml
    print_step "Waiting for Backend to be ready..."
    kubectl wait --for=condition=ready pod -l app=backend -n $NAMESPACE --timeout=300s
    
    # Deploy Frontend
    print_step "Deploying Frontend..."
    kubectl apply -f $K8S_DIR/frontend-deployment.yaml
    
    # Deploy Ingress
    print_step "Deploying Ingress..."
    kubectl apply -f $K8S_DIR/ingress.yaml
    
    # Deploy HPA
    print_step "Deploying Horizontal Pod Autoscaler..."
    kubectl apply -f $K8S_DIR/hpa.yaml || print_warning "HPA deployment failed (metrics-server might not be installed)"
    
    print_step "Deployment completed successfully!"
    print_status
}

update() {
    print_step "Updating Pet Management deployment..."
    
    # Update ConfigMaps and Secrets
    kubectl apply -f $K8S_DIR/mysql-secret.yaml
    kubectl apply -f $K8S_DIR/mysql-configmap.yaml
    kubectl apply -f $K8S_DIR/backend-configmap.yaml
    
    # Update deployments
    kubectl apply -f $K8S_DIR/backend-deployment.yaml
    kubectl apply -f $K8S_DIR/frontend-deployment.yaml
    kubectl apply -f $K8S_DIR/ingress.yaml
    kubectl apply -f $K8S_DIR/hpa.yaml || print_warning "HPA update failed"
    
    # Restart deployments to pick up changes
    kubectl rollout restart deployment/backend -n $NAMESPACE
    kubectl rollout restart deployment/frontend -n $NAMESPACE
    
    print_step "Update completed!"
}

delete() {
    print_warning "This will delete all Pet Management resources!"
    read -p "Are you sure? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        print_step "Deletion cancelled"
        exit 0
    fi
    
    print_step "Deleting Pet Management deployment..."
    kubectl delete namespace $NAMESPACE
    print_step "Deletion completed"
}

print_status() {
    print_step "Current deployment status:"
    echo ""
    echo "=== Pods ==="
    kubectl get pods -n $NAMESPACE
    echo ""
    echo "=== Services ==="
    kubectl get svc -n $NAMESPACE
    echo ""
    echo "=== Ingress ==="
    kubectl get ingress -n $NAMESPACE
    echo ""
    echo "=== HPA ==="
    kubectl get hpa -n $NAMESPACE || print_warning "HPA not available"
    echo ""
    
    # Get Ingress URL
    INGRESS_IP=$(kubectl get ingress pet-management-ingress -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null)
    if [ -n "$INGRESS_IP" ]; then
        print_step "Application URL: http://$INGRESS_IP"
    else
        print_warning "Ingress IP not yet assigned"
    fi
}

logs() {
    SERVICE=$1
    if [ -z "$SERVICE" ]; then
        print_error "Please specify a service (backend|frontend|mysql|kafka)"
        exit 1
    fi
    
    case $SERVICE in
        backend)
            kubectl logs -f deployment/backend -n $NAMESPACE
            ;;
        frontend)
            kubectl logs -f deployment/frontend -n $NAMESPACE
            ;;
        mysql)
            kubectl logs -f statefulset/mysql -n $NAMESPACE
            ;;
        kafka)
            kubectl logs -f statefulset/kafka -n $NAMESPACE
            ;;
        *)
            print_error "Unknown service: $SERVICE"
            exit 1
            ;;
    esac
}

case "$1" in
    install)
        check_prerequisites
        install
        ;;
    update)
        check_prerequisites
        update
        ;;
    delete)
        delete
        ;;
    status)
        print_status
        ;;
    logs)
        logs $2
        ;;
    *)
        echo "Usage: $0 {install|update|delete|status|logs}"
        echo ""
        echo "Commands:"
        echo "  install  - Deploy Pet Management to Kubernetes"
        echo "  update   - Update existing deployment"
        echo "  delete   - Remove all resources"
        echo "  status   - Show deployment status"
        echo "  logs     - Show logs for a service (backend|frontend|mysql|kafka)"
        exit 1
        ;;
esac

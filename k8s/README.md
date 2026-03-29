# Kubernetes Deployment - Pet Management System

## Cấu trúc thư mục

```
k8s/
├── namespace.yaml              # Namespace riêng cho project
├── mysql-secret.yaml           # Secrets cho MySQL, JWT, VNPay
├── mysql-configmap.yaml        # Init script cho MySQL
├── mysql-pvc.yaml             # Persistent Volume Claim cho MySQL
├── mysql-deployment.yaml       # MySQL StatefulSet và Service
├── kafka-deployment.yaml       # Kafka + Zookeeper StatefulSet
├── backend-configmap.yaml      # Environment config cho Backend
├── backend-deployment.yaml     # Backend Deployment và Service
├── frontend-deployment.yaml    # Frontend Deployment và Service
├── ingress.yaml               # Ingress controller (routing)
├── hpa.yaml                   # Horizontal Pod Autoscaler
└── README.md                  # File này
```

## Yêu cầu

### 1. Kubernetes Cluster
Chọn 1 trong các option:

#### Local Development
```bash
# Minikube
minikube start --cpus=4 --memory=8192

# Enable Ingress
minikube addons enable ingress
```

#### Cloud Providers
- **Google Kubernetes Engine (GKE)**: `gcloud container clusters create pet-management`
- **Amazon EKS**: `eksctl create cluster --name pet-management`
- **Azure AKS**: `az aks create --name pet-management`

### 2. kubectl
```bash
# Check version
kubectl version --client

# Set context to your cluster
kubectl config use-context <your-cluster>
```

### 3. Docker Images
Build và push images lên registry:

```bash
# Backend
cd PetCareManagement
docker build -t your-registry/pet-management-backend:latest .
docker push your-registry/pet-management-backend:latest

# Frontend
cd pet_care_management_fe
docker build -t your-registry/pet-management-frontend:latest .
docker push your-registry/pet-management-frontend:latest
```

## Cấu hình trước khi deploy

### 1. Cập nhật Secrets (QUAN TRỌNG!)

```bash
# Generate base64 encoded values
echo -n "your-mysql-password" | base64
echo -n "your-jwt-secret-key" | base64

# Edit mysql-secret.yaml và thay thế các giá trị
```

### 2. Cập nhật ConfigMaps

**backend-configmap.yaml**:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `OAUTH2_REDIRECT_URL`
- `VNPAY_RETURN_URL`

**frontend-configmap.yaml**:
- `REACT_APP_API_URL`
- `REACT_APP_WS_URL`

### 3. Cập nhật Image URLs

Sửa trong các file deployment:
- `backend-deployment.yaml`: `image: your-registry/pet-management-backend:latest`
- `frontend-deployment.yaml`: `image: your-registry/pet-management-frontend:latest`

### 4. Cập nhật Ingress Domain

**ingress.yaml**:
```yaml
rules:
- host: petmanagement.yourdomain.com  # Đổi domain
```

## Deployment Steps

### Bước 1: Tạo Namespace
```bash
kubectl apply -f k8s/namespace.yaml
```

### Bước 2: Deploy Secrets và ConfigMaps
```bash
kubectl apply -f k8s/mysql-secret.yaml
kubectl apply -f k8s/mysql-configmap.yaml
kubectl apply -f k8s/backend-configmap.yaml
```

### Bước 3: Deploy Persistent Volumes
```bash
kubectl apply -f k8s/mysql-pvc.yaml
```

### Bước 4: Deploy Database (MySQL)
```bash
kubectl apply -f k8s/mysql-deployment.yaml

# Wait for MySQL to be ready
kubectl wait --for=condition=ready pod -l app=mysql -n pet-management --timeout=300s
```

### Bước 5: Deploy Kafka
```bash
kubectl apply -f k8s/kafka-deployment.yaml

# Wait for Kafka to be ready
kubectl wait --for=condition=ready pod -l app=kafka -n pet-management --timeout=300s
```

### Bước 6: Deploy Backend
```bash
kubectl apply -f k8s/backend-deployment.yaml

# Check logs
kubectl logs -f deployment/backend -n pet-management
```

### Bước 7: Deploy Frontend
```bash
kubectl apply -f k8s/frontend-deployment.yaml
```

### Bước 8: Deploy Ingress
```bash
kubectl apply -f k8s/ingress.yaml
```

### Bước 9: Deploy Auto-scaling (Optional)
```bash
# Cần metrics-server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Apply HPA
kubectl apply -f k8s/hpa.yaml
```

### Bước 10: Verify Deployment
```bash
# Check all resources
kubectl get all -n pet-management

# Check pods
kubectl get pods -n pet-management

# Check services
kubectl get svc -n pet-management

# Check ingress
kubectl get ingress -n pet-management
```

## Truy cập ứng dụng

### Local (Minikube)
```bash
# Get Minikube IP
minikube ip

# Add to /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
<minikube-ip> petmanagement.local

# Access: http://petmanagement.local
```

### Cloud
Cấu hình DNS trỏ domain về Load Balancer IP của Ingress:
```bash
kubectl get ingress -n pet-management
```

## Quản lý

### Xem logs
```bash
# Backend logs
kubectl logs -f deployment/backend -n pet-management

# Frontend logs
kubectl logs -f deployment/frontend -n pet-management

# MySQL logs
kubectl logs -f statefulset/mysql -n pet-management
```

### Scale manual
```bash
# Scale backend
kubectl scale deployment backend --replicas=5 -n pet-management

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n pet-management
```

### Update application
```bash
# Update backend image
kubectl set image deployment/backend backend=your-registry/pet-management-backend:v2 -n pet-management

# Rollout status
kubectl rollout status deployment/backend -n pet-management

# Rollback if needed
kubectl rollout undo deployment/backend -n pet-management
```

### Debug
```bash
# Describe pod
kubectl describe pod <pod-name> -n pet-management

# Execute into pod
kubectl exec -it <pod-name> -n pet-management -- /bin/bash

# Port forward for debugging
kubectl port-forward svc/backend-service 8080:8080 -n pet-management
```

## Xóa toàn bộ deployment

```bash
# Delete all resources in namespace
kubectl delete namespace pet-management

# Or delete individually
kubectl delete -f k8s/
```

## Monitoring (Optional)

### Install Prometheus + Grafana
```bash
# Add Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# Access Grafana
kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring
# Default: admin/prom-operator
```

## Backup & Restore

### Backup MySQL
```bash
kubectl exec -it mysql-0 -n pet-management -- mysqldump -u root -p pet_care_management > backup.sql
```

### Restore MySQL
```bash
kubectl exec -i mysql-0 -n pet-management -- mysql -u root -p pet_care_management < backup.sql
```

## Troubleshooting

### Pods không start
```bash
kubectl describe pod <pod-name> -n pet-management
kubectl logs <pod-name> -n pet-management
```

### Không connect được MySQL
```bash
# Test connection
kubectl run -it --rm debug --image=mysql:8.0 --restart=Never -n pet-management -- mysql -h mysql-service -u root -p
```

### Backend không kết nối Kafka
```bash
# Check Kafka logs
kubectl logs -f statefulset/kafka -n pet-management
```

## Resource Limits

Điều chỉnh trong deployment files nếu cần:

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

## Cost Estimation (Cloud)

### Google Cloud (GKE)
- 3 nodes x n1-standard-2: ~$150/month
- Load Balancer: ~$18/month
- Storage: ~$10/month
**Total**: ~$180/month

### AWS (EKS)
- Cluster: $73/month
- 3 nodes x t3.medium: ~$100/month
- Load Balancer: ~$18/month
**Total**: ~$190/month

## Support

Nếu gặp vấn đề, check:
1. Pod status: `kubectl get pods -n pet-management`
2. Events: `kubectl get events -n pet-management --sort-by='.lastTimestamp'`
3. Logs: `kubectl logs <pod-name> -n pet-management`

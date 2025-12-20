# ============================================
# Docker Build & Run Instructions
# ============================================

## Quick Start with Docker Compose (Recommended)

### 1. Start all services (MySQL + Backend + Frontend)
```bash
docker-compose up -d --build
```

### 2. Check status
```bash
docker-compose ps
```

### 3. View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f mysql
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 4. Stop all services
```bash
docker-compose down
```

### 5. Stop and remove volumes (xóa data)
```bash
docker-compose down -v
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Backend Health Check**: http://localhost:8080/actuator/health
- **MySQL**: localhost:3307 (mapped from container port 3306)
  - Username: root
  - Password: Kenkenken@1
  - Database: petcaremanagement

## Individual Service Build (Advanced)

### MySQL Database (included in docker-compose)

Connect to MySQL:
```bash
# From host machine
mysql -h 127.0.0.1 -P 3307 -u root -pKenkenken@1 petcaremanagement

# Or using Docker exec
docker exec -it petcare-mysql mysql -u root -pKenkenken@1 petcaremanagement
```

### Backend (Spring Boot)

### Build Docker Image
```bash
cd PetCareManagement
docker build -t petcare-backend:latest .
```

### Run Backend Container (with docker-compose network)
```bash
docker run -d \
  --name petcare-backend \
  --network petcare-network \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/petcaremanagement \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=Kenkenken@1 \
  petcare-backend:latest
```

## Frontend (React)

### Build Docker Image
```bash
cd pet_care_management_fe
docker build -t petcare-frontend:latest .
```

### Run Frontend Container
```bash
docker run -d \
  --name petcare-frontend \
  -p 3000:80 \
  petcare-frontend:latest
```

## Using Docker Compose (Recommended)

### Start all services
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild and restart
```bash
docker-compose up -d --build
```

### Restart specific service
```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql
```

## Architecture

```
┌─────────────────────────────────────────────┐
│          Docker Compose Network             │
│                                             │
│  ┌─────────────┐  ┌──────────────┐        │
│  │   MySQL     │  │   Backend    │        │
│  │   :3306     │◄─┤   :8080      │        │
│  │  (3307)     │  │              │        │
│  └─────────────┘  └──────────────┘        │
│                          ▲                  │
│                          │                  │
│                   ┌──────────────┐         │
│                   │   Frontend   │         │
│                   │   Nginx:80   │         │
│                   │   (3000)     │         │
│                   └──────────────┘         │
└─────────────────────────────────────────────┘
```

## Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Backend Health Check: http://localhost:8080/actuator/health

## Notes

1. **Database**: MySQL được tự động khởi tạo với database `petcaremanagement`
2. **Port Mapping**: 
   - Frontend: 3000 → 80 (Nginx)
   - Backend: 8080 → 8080
   - MySQL: 3307 → 3306 (để tránh conflict với MySQL local)
3. **Network**: Tất cả services chạy trong cùng network `petcare-network`
4. **Volumes**: 
   - `mysql_data`: Lưu trữ database data
   - `backend_uploads`: Lưu trữ file uploads
5. **Health Checks**: Services được monitor và tự động restart nếu unhealthy
6. **Init SQL**: File `db.sql` tự động import khi MySQL khởi động lần đầu

## Environment Variables

Có thể custom trong `docker-compose.yml`:

### Backend
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### MySQL
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_DATABASE`

## Troubleshooting

### Check container logs
```bash
docker logs petcare-backend
docker logs petcare-frontend
```

### Restart containers
```bash
docker restart petcare-backend
docker restart petcare-frontend
```

### Remove and recreate
```bash
docker rm -f petcare-backend petcare-frontend
# Then run the containers again
```

# Custom MySQL image with pre-loaded data
FROM mysql:8.0

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=Kenkenken@1
ENV MYSQL_DATABASE=petcaremanagement
ENV MYSQL_CHARACTER_SET_SERVER=utf8mb4
ENV MYSQL_COLLATION_SERVER=utf8mb4_unicode_ci
ENV TZ=Asia/Ho_Chi_Minh

# Copy SQL initialization script
COPY db.sql /docker-entrypoint-initdb.d/01-init.sql

# Expose MySQL port
EXPOSE 3306

# Use default MySQL command with custom settings
CMD ["--default-authentication-plugin=mysql_native_password", "--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci"]

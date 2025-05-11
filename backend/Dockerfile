FROM node:18-alpine

WORKDIR /app

# Cài đặt các công cụ cần thiết
RUN apk add --no-cache bash curl postgresql-client

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install
RUN npm install pg

# Sao chép toàn bộ mã nguồn
COPY . .

# Expose port
EXPOSE 3000 3002

# Khởi động ứng dụng
CMD ["npm", "start"]
FROM node:22-slim

WORKDIR /app

# Cài đặt các công cụ cần thiết
RUN apt-get update && apt-get install -y bash curl postgresql-client

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Expose port
EXPOSE 3000 3002

# Khởi động ứng dụng
CMD ["npm", "start"]
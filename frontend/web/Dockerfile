FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3001

# Sử dụng host 0.0.0.0 để bind đến tất cả địa chỉ IP
CMD ["sh", "-c", "export PORT=3001 && HOST=0.0.0.0 npm start"]
FROM node:22-slim

WORKDIR /app

# Cài đặt OpenSSL cho Prisma và thêm công cụ wait-for-it
RUN apt-get update -y && apt-get install -y openssl netcat-openbsd wget

# Tải script wait-for-it
RUN wget -O /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x /usr/local/bin/wait-for-it.sh

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000
EXPOSE 3002

# Dùng script chờ thay vì chạy trực tiếp
CMD ["/bin/bash", "-c", "wait-for-it.sh mysql:3306 -t 60 -- npm start"]
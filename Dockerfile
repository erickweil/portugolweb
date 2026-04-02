# Faz build primeiro, em outro estágio
FROM node:24-alpine AS builder

ENV NODE_ENV=development
ENV BASE_URL=/

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# https://lipanski.com/posts/smallest-docker-image-static-website
# Menor imagem possível para servir um site
FROM busybox:stable

EXPOSE 80

# Copy the static website
# Use the .dockerignore file to control what ends up inside the image!
WORKDIR /home/static
COPY --from=builder /app/dist/ .

# Run BusyBox httpd
CMD ["busybox", "httpd", "-f", "-v", "-p", "80"]

# Para montar e executar a imagem com o Docker utilize:
# docker build -t portugol .
# docker run -d -p 80:80 portugol
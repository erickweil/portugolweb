# https://lipanski.com/posts/smallest-docker-image-static-website
# Menor imagem possível para servir um site
FROM busybox:1.35
EXPOSE 80
# Copy the static website
# Use the .dockerignore file to control what ends up inside the image!
WORKDIR /home/static

COPY . .

# Run BusyBox httpd
CMD ["busybox", "httpd", "-f", "-v", "-p", "80"]
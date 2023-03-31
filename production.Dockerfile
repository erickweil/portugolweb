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

# depois de copiar tudo fica 5.64MB (2.67 MB comprimidos)
# comando para build (Usando BUILDKIT=1 para ter um .dockerignore para cada Dockerfile na mesma pasta):
# DOCKER_BUILDKIT=1 docker build -t portugol -f production.Dockerfile .
# docker run -d --name portugol -p 80:80 portugol
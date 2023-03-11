# https://lipanski.com/posts/smallest-docker-image-static-website
# Menor imagem possível para servir um site
# Criando de forma que rode como root, para que o mapeamento de
# Pasta compartilhada do VirtualBox funcione (nginx não funciona).
FROM busybox:1.35

EXPOSE 80

# Copy the static website
# Use the .dockerignore file to control what ends up inside the image!
WORKDIR /home/static
COPY . .

# Run BusyBox httpd
CMD ["busybox", "httpd", "-f", "-v", "-p", "80"]

# Para montar e executar a imagem com o Docker utilize:
# docker build -t portugol .
# docker run -d -p 80:80 portugol

# Se quiser executar a imagem do site em uma pasta 
# que contém os sites .html em seu computador
# docker run -d -p 80:80 -v /caminho/da/pasta/:/home/static erickweil/portugolweb
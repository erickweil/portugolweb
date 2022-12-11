FROM nginx

EXPOSE 80

COPY . /usr/share/nginx/html
# Para montar e executar a imagem com o Docker utilize:
# docker build -t portugol .
# docker run -d -p 80:80 portugol
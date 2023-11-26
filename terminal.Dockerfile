# A ideia é poder executar um programa em Portugol no terminal, sem precisar instalar nada.
# Há duas formas de utilizar esta imagem, Criando outro Dockerfile copiando o arquivo .por ou
# mapeando um volume para o arquivo portugol que será executado.

FROM node:20-alpine3.18

WORKDIR /app

COPY . .

RUN npm install

ENTRYPOINT ["node", "terminal.js"]

# docker build -t erickweil/portugolweb:terminal -f terminal.Dockerfile .
# docker run -it --rm erickweil/portugolweb:terminal -v ./:/app/exemplos --programa ./exemplos/entrada.por
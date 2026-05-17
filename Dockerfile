# Usa uma imagem do Node (o log anterior mostrou que você estava no Node 24)
FROM node:24-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependência primeiro (boa prática para cache)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código
COPY . .

# Expõe a porta que o seu compose está pedindo (3100)
EXPOSE 3100

# Comando para iniciar o frontend
CMD ["npm", "run", "dev"]
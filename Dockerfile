# Use uma imagem base com Node.js
FROM node:18

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos para dentro do container
COPY package.json package-lock.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos
COPY . .

# Execute o build
RUN npm run build

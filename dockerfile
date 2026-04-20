FROM nginx:alpine
# Copia todos os seus arquivos do ZIP para a pasta que o Nginx usa para servir sites
COPY . /usr/share/nginx/html
EXPOSE 80
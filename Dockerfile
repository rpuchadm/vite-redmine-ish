# Usa una imagen base oficial de NGINX
FROM nginx:alpine

# Copia los archivos generados por Vite al directorio raíz de NGINX
COPY dist /usr/share/nginx/html

# Copia una configuración personalizada de NGINX (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 para que el contenedor sirva la aplicación
EXPOSE 80

# Inicia NGINX
CMD ["nginx", "-g", "daemon off;"]

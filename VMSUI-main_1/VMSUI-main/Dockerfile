# Build stage
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

# Serve stage
FROM nginx:1.25.3-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]


# # Build stage
# FROM node:18 AS build

# WORKDIR /app

# COPY package*.json ./
# COPY .env ./ 

# RUN npm install
# COPY . .   
# RUN npm run build

# # Serve stage
# FROM nginx:1.25.3-alpine

# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /app/build /usr/share/nginx/html

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
# Stage 1: Build the React application
FROM node:22-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the frontend source code
COPY . .

# Create the production build
RUN npm run build


# Stage 2: Serve the React application using Nginx
FROM nginx:alpine

# Copy the React production build into Nginx's web directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx's HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
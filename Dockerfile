FROM node:22

WORKDIR /app

# Disable SSL strict mode (optional but keep)
RUN npm config set strict-ssl false

# Use OpenSSL legacy provider to fix cipher errors
ENV NODE_OPTIONS=--openssl-legacy-provider

COPY package*.json ./

# Add this line to fix SSL issue
RUN npm config set strict-ssl false

# Optional: set registry explicitly (use HTTPS)
# RUN npm config set registry https://registry.npmjs.org/

RUN npm install

COPY . .

EXPOSE 3000
CMD ["sh", "-c", "npx prisma generate && npm start"]

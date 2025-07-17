FROM node:22

WORKDIR /app

COPY package*.json ./

# Add this line to fix SSL issue
RUN npm config set strict-ssl false

# Optional: set registry explicitly (use HTTPS)
# RUN npm config set registry https://registry.npmjs.org/

RUN npm install

COPY . .

EXPOSE 3000
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate reset --force && npx prisma migrate deploy && npm start"]

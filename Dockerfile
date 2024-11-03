# Étape de build
FROM node:20-slim as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape de production
FROM node:20-slim
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/server.js .
COPY package*.json ./
RUN npm install --only=production

ENV NODE_ENV=production
ENV PORT=5003

EXPOSE 5003
CMD ["npm", "start"]
FROM node:20-slim

WORKDIR /app

# Copier les fichiers package.json
COPY package*.json ./
COPY backend/package*.json ./backend/

# Installer les dépendances
RUN npm install
RUN cd backend && npm install

# Copier le reste des fichiers
COPY . .

# Builder le frontend
RUN npm run build

ENV NODE_ENV=production
ENV PORT=5002

EXPOSE 5002

# Démarrer le serveur Node qui servira aussi les fichiers statiques
CMD ["npm", "start"]
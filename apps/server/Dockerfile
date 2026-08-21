FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .

RUN npm run build

RUN npm prune --production

ENV NODE_ENV=production

CMD ["npm", "start"]
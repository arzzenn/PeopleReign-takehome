FROM node:20-alpine
RUN apk add --no-cache bash

RUN npm config set audit false
RUN npm config set fund false

# Compile app
USER node
WORKDIR /app

# Install dependencies
COPY --chown=node:node package.json package-lock.json ./
RUN ls -la
RUN npm ci --verbose

# Install all directories and build
COPY --chown=node:node ./ /app
RUN chmod +x scripts/wait-for-it.sh

# Use "production" in NodeJs
ENV NODE_ENV=production

ENTRYPOINT [ "./scripts/wait-for-it.sh", "--timeout=60", "pet-store:3330", "--", "/usr/local/bin/npm", "run", "start" ]

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
RUN npm run build 

# Use "production" in NodeJs
ENV NODE_ENV=production

ENTRYPOINT [ "./scripts/start_app.sh" ]

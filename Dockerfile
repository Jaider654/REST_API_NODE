FROM node:18.15.0
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
ENTRYPOINT [ "npm", "start" ]
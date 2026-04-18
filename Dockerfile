FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Set environment
ENV NODE_ENV=production

# The port your app binds to
EXPOSE 3000

# Start command
CMD [ "npm", "start" ]

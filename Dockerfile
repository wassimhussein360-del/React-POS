# build stage
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Compile TypeScript (if not precompiled)
RUN npm run build   

# Expose the port that the Next.js app will run on
EXPOSE 3000

# Define the command to run your Next.js app
CMD [ "npm", "run", "start_prod"]
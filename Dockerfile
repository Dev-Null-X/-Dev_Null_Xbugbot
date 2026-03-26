# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  🚀 DEV_NULL_X RENDER DEPLOYMENT (NODE 20+)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Base Image (Node.js 20 LTS - Super Fast & Stable)
FROM node:20-bookworm-slim

# Install system dependencies (Git for GitHub packages, FFmpeg for media)
RUN apt-get update && \
    apt-get install -y git ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to install dependencies first (faster build cache)
COPY package*.json ./

# Install NPM dependencies
RUN npm install

# Copy all the rest of the bot files to the container
COPY . .

# Expose port (Render needs this if you deploy as a Web Service)
EXPOSE 3000

# Start the Dev_Null_X Engine
CMD ["node", "index.js"]

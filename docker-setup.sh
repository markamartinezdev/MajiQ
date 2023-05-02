#!/bin/bash

# Step 1: Bring down the docker containers and remove volumes
docker compose down --volumes

# Step 2: Remove the image with the specified name
docker rmi mtgtable

# Step 3: Build the image again, using the specified tag and no cache
docker build -t mtgtable . --no-cache

# Step 4: Start the containers in detached mode
docker compose up -d

# Finished
echo "Docker setup completed."

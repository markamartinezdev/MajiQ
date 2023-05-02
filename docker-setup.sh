#!/bin/bash

# Combine the commands using semicolons
docker-compose down --volumes ; \
docker rmi mtgtable ; \
docker build -t mtgtable . --no-cache ; \
docker-compose up -d

# Finished
echo "Docker setup completed."
git st
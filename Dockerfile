# Use an official Ubuntu image as the base
FROM ubuntu:latest

# Set working directory
WORKDIR /app

# Copy files from the host machine to the container
COPY . /app

# Run a command inside the container
RUN apt update && apt install -y python3

# Set the command that runs when the container starts
ENTRYPOINT ["bash"]

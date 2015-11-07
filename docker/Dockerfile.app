# Set the base image to Debian
FROM   debian:7

# File Author / Maintainer
MAINTAINER EFU

# Install Node.js and other dependencies
RUN apt-get -qq update && \
    apt-get -qq -y install curl && \
    curl --silent --location https://deb.nodesource.com/setup_4.x | bash - && \
    apt-get install --yes nodejs

# Check out the code and install packages
RUN apt-get -qq -y install git && \
    apt-get -qq -y install build-essential && \
    git clone https://github.com/ericfu88/humanapitestserver && \
    cd humanapitestserver && \
    npm install

# Define working directory
WORKDIR /humanapitestserver

# Expose port
EXPOSE  80

# Set Env
ENV NODE_ENV=dev

# Run app using node
CMD ["node", "/humanapitestserver/index.js"]

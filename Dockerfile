FROM node:16
# Create app directory
WORKDIR /usr/src/app
RUN git clone https://github.com/markamartinezdev/MajiQ.git .
RUN npm install
CMD [ "node", "index.js" ]
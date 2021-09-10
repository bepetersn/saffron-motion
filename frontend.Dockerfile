
FROM nikolaik/python-nodejs:latest

WORKDIR /root
ADD . .
RUN yarn install && yarn build

CMD yarn serve -s build
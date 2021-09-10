
FROM nikolaik/python-nodejs:latest

WORKDIR /root
ADD saffron_motion .
RUN yarn install && yarn build

CMD yarn serve -s build
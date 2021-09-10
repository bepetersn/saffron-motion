FROM nikolaik/python-nodejs:latest

EXPOSE 3000
WORKDIR /root
ADD saffron_motion .
RUN yarn install && yarn build

CMD yarn serve -s build

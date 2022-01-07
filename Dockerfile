# build environment
FROM node:13.12.0-alpine as frontend-build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
#RUN npm ci --silent
RUN npm install -q
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine as frontend-run
COPY --from=frontend-build /app/build /usr/share/nginx/html
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
RUN apk add npm
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
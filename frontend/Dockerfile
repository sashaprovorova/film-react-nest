# build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# export
FROM alpine:3.20
WORKDIR /dist
COPY --from=build /app/dist ./

CMD ["sh", "-lc", "ls -la /dist && echo OK && tail -f /dev/null"]

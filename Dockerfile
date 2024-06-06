WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run db:generate

RUN pnpm run build

FROM node:20-alpine AS runtime

WORKDIR /app

COPY --from=base /app .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "./build/main.js"]
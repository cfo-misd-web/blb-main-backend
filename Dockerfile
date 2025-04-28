# ---- Build Stage ----
FROM node:23-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install --production=false
COPY . .
RUN npm run build || npx tsc

# ---- Production Stage ----
FROM node:23-alpine AS prod
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/server/db/blbmain.db ./server/db/blbmain.db
COPY --from=build /app/server/uploads ./server/uploads
# COPY --from=build /app/.env ./.env
ENV NODE_ENV=production
CMD ["node", "dist/src/index.js"]

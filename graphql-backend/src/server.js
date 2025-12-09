import http from "http";
import express from "express";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

import app from "./app.js";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";

async function start() {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        embed: true
      })
    ]
  });

  await apollo.start();

  app.use("/graphql", express.json(), expressMiddleware(apollo));

  const server = http.createServer(app);
  const PORT = process.env.PORT || 3001;

  server.listen(PORT, function () {
    console.log(`GraphQL server running on http://localhost:${PORT}/graphql`);
  });
}

start();

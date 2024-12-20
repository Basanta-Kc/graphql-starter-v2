const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { expressMiddleware } = require("@apollo/server/express4");
const gql = require("graphql-tag");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const resolvers = require("./resolvers");
const { readFileSync } = require("fs");

// These starter configuration are copied from the documentations
// https://apollographql.com/docs/apollo-server/integrations/mern

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const typeDefs = gql(
    readFileSync("schema.graphql", {
      encoding: "utf-8",
    })
  );

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  await server.start();
  app.use("/graphql", cors(), express.json(), expressMiddleware(server));

  await mongoose.connect("mongodb://localhost:27017/mern-5-graph-todo");

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  });
};

startServer();

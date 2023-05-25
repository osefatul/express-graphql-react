import cors from 'cors';
import express from 'express';
import {ApolloServer} from '@apollo/server';

// The expressMiddleware enables you to attach Apollo Server to an Express server.
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import {readFile} from 'node:fs/promises';
import { authMiddleware, handleLogin } from './auth.js';

import { resolvers } from './resolvers.js';
const typeDefs = await readFile('./schema.graphql', 'utf8');

const PORT = 9000;
const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
app.use('/graphql', apolloMiddleware(apolloServer));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
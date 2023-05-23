const dotenv = require('dotenv');
dotenv.config();

const { createServer } = require('http');
const express = require('express');
const mongoose = require('mongoose');

const { subscribe, execute } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { PubSub } = require('graphql-subscriptions');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');

const resolvers = require('./graphQL');
const typeDefs = require('./graphQL/typeDefs');
const PORT = process.env.PORT || 4000;


console.log("Connected to MongoDB")
mongoose.connect(process.env.MONGO_URL).then(
).catch(err => console.error(err));


(async (typeDefs, resolvers) => {
    const app = express();
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const httpServer = createServer(app);
    const pubSub = new PubSub();

    const server = new ApolloServer({ 
        schema,
        context: ({req}) => ({ req, pubSub }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), {
            async serverWillStart() {
                return {
                    async drainServer() {
                        subscriptionServer.close();
                    }
                }
            }
        }],
    });

    const subscriptionServer = SubscriptionServer.create({
        schema,
        execute,
        subscribe,
        async onConnect() {
            console.log('Connected!');
            return {
                pubSub
            }
        },
        onDisconnect() {
            console.log('Disconnected!');
        }
    }, {
        server: httpServer,
        path: server.graphqlPath
    })
    await server.start();
    server.applyMiddleware({ app });
    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
    console.log(`Server ready at  http://localhost:${PORT}${server.graphqlPath}`);
})(typeDefs, resolvers);

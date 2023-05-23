import dotenv from 'dotenv';
dotenv.config();

import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import {typeDefs} from './models/typeDefs.js';
import {resolvers} from './resolvers.js';
import mongoose from 'mongoose';



mongoose.set("strictQuery", false);
console.log("Connected to Mongodb")
mongoose.connect(process.env.MONGO_URL).then(
).catch(err => console.error(err));


const server = new ApolloServer({typeDefs, resolvers});
const { url } = await startStandaloneServer(server, {
    listen: {
        port: 4000,
    },
});

console.info(`🚀 Server ready at ${url}`);
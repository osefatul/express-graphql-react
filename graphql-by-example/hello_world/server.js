import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';




const typeDefs = `#graphql
  type Query {
    greeting: String!
    person(name:String!): String!
  }
`;

const resolvers = {
  Query: {
    greeting: (parent, args) => {
      return `Hello, Good morning!`
    },

    person: (parent, args) => {
      return `Mr/Ms.${args.name}`
    }
  },
};


const server = new ApolloServer({typeDefs, resolvers});
const {url} = await startStandaloneServer(server, {listen: {port:4000}})
console.log('Apollo server is listening on at', url)
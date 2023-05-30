import { GraphQLError } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { createMessage, getMessages } from './db/messages.js';

const pubSub = new PubSub();

export const resolvers = {
  Query: {
    messages: (_root, _args, { user }) => {
      if (!user) throw unauthorizedError();
      return getMessages();
    },
  },

  Mutation: {
    addMessage: async (_root, { text }, { user }) => {
      if (!user) throw unauthorizedError();
      const message = await createMessage(user, text);
      //If subscription is still listening then, publish message to the client subscribed to 'MESSAGE_ADDED'
      pubSub.publish('MESSAGE_ADDED', { messageAdded: message });
      return message;
    },
  },

  //Subscriptions do not return single value, normally they return and generate multiple values over time.Rather than returning any data directly, they return an AsyncIterator which subsequently is used by the GraphQL server to push the event data to the client.
  Subscription: {
    messageAdded: {
      subscribe: (_root, _args, { user }) => {
        if (!user) throw unauthorizedError();
        return pubSub.asyncIterator('MESSAGE_ADDED'); //Listen
      },
      // resolve: payload => {
      //   console.log(payload);
      // }
    },
  },
};

function unauthorizedError() {
  return new GraphQLError('Not authenticated', {
    extensions: { code: 'UNAUTHORIZED' },
  });
}

import { ApolloClient, ApolloLink, concat, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';
import { createClient as createWsClient } from 'graphql-ws';
import { getAccessToken } from '../auth';

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

const httpLink = concat(authLink, createHttpLink({
  uri: 'http://localhost:9000/graphql'
}));


// As we know from the above codes, that for query and mutations of messages we need accessToken to be used with http request. Same for websocket requests... so to use accessToken with websocket we send it connectionParams: So instead of passing an object to connectionParams, we use function to create an object with accessToken so it can be used accessed after when a user is authenticated.
const wsLink = new GraphQLWsLink(createWsClient({
  url: 'ws://localhost:9000/graphql',
  connectionParams: () => ({ accessToken: getAccessToken() }),
}));

export const apolloClient = new ApolloClient({

  //split request: if isSubscription is true, it will use wsLink, otherwise it will use httpLink
  link: split(isSubscription, wsLink, httpLink),
  cache: new InMemoryCache(),
});

function isSubscription(operation) {
  const definition = getMainDefinition(operation.query);
  return definition.kind === Kind.OPERATION_DEFINITION
    && definition.operation === OperationTypeNode.SUBSCRIPTION;
}

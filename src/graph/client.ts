import { GraphQLClient } from 'graphql-request';
import pRetry from 'p-retry';
import { config } from '../config';

const endpoint = `https://gateway.thegraph.com/api/${config.GRAPH_API_KEY}/subgraphs/id/${config.UNISWAP_V3_ARBITRUM_SUBGRAPH_ID}`;
export const client = new GraphQLClient(endpoint);

export function requestGQL<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  return pRetry(() => client.request<T>(query, variables), {
    retries: config.MAX_RETRIES,
  });
}

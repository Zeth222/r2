# Uniswap V3 Arbitrum Telegram Bot

Bot headless em Node.js + TypeScript que consulta a Uniswap v3 na rede Arbitrum via The Graph e envia alertas pelo Telegram.

## Pré-requisitos
- Node.js 18+
- API key do The Graph (Graph Studio/Explorer)
- Token e chat id do Telegram

## Criar API Key e Subgraph ID
1. Acesse [https://thegraph.com/studio](https://thegraph.com/studio) e crie uma API Key.
2. No Explorer, localize o subgraph oficial da Uniswap v3 na Arbitrum e copie o identificador após `subgraphs/id/`.

## Configuração
1. Copie `.env.example` para `.env` e preencha os valores.
2. `GRAPH_API_KEY` – API key criada no passo anterior.
3. `UNISWAP_V3_ARBITRUM_SUBGRAPH_ID` – identificador do subgraph.
4. `WALLET_ADDRESS` – endereço da carteira (checksum) a monitorar.
5. Demais variáveis são opcionais e possuem valores padrão.

## Scripts
- `npm run dev` – execução com tsx.
- `npm run build` – gera build com tsup.
- `npm start` – roda código buildado.

## Consultas GraphQL
Exemplos de queries utilizadas pelo bot:
```graphql
# Posições por dono
query PositionsByOwner($owner: Bytes!, $first: Int!, $skip: Int!) {
  positions(where: { owner: $owner }, first: $first, skip: $skip) {
    id
    owner
    liquidity
    tickLower { tickIdx }
    tickUpper { tickIdx }
    pool {
      id
      feeTier
      tick
      sqrtPriceX96
      token0 { id symbol decimals }
      token1 { id symbol decimals }
      liquidity
      totalValueLockedToken0
      totalValueLockedToken1
    }
    depositedToken0
    depositedToken1
    withdrawnToken0
    withdrawnToken1
    collectedFeesToken0
    collectedFeesToken1
  }
}
```
Outras queries: `PositionSnapshots`, `Pool`, `PoolDayDatas`, `TokenDayDatas` e `RecentSwaps` (ver em `src/graph/queries.ts`).

## Troubleshooting
- **Rate limit**: utilize `MAX_RETRIES` e backoff com `p-retry`.
- **Paginação**: grandes carteiras exigem varrer `positions` em lotes (`first/skip`).
- **Campos ausentes**: o schema do subgraph pode mudar; valide sempre as respostas.


export const POSITIONS_BY_OWNER = `
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
}`;

export const POSITION_SNAPSHOTS = `
query PositionSnapshots($positionId: ID!, $first: Int!) {
  positionSnapshots(where: { position: $positionId }, orderBy: timestamp, orderDirection: desc, first: $first) {
    timestamp
    liquidity
    depositedToken0
    depositedToken1
    withdrawnToken0
    withdrawnToken1
    collectedFeesToken0
    collectedFeesToken1
    transaction { id }
  }
}`;

export const POOL_QUERY = `
query Pool($poolId: ID!) {
  pool(id: $poolId) {
    id
    feeTier
    tick
    sqrtPriceX96
    token0 { id symbol decimals }
    token1 { id symbol decimals }
    liquidity
    totalValueLockedToken0
    totalValueLockedToken1
    volumeUSD
    txCount
  }
}`;

export const POOL_DAY_DATAS = `
query PoolDayDatas($poolId: ID!, $first: Int!) {
  poolDayDatas(where: { pool: $poolId }, orderBy: date, orderDirection: desc, first: $first) {
    date
    volumeUSD
    tvlUSD
    feesUSD
    sqrtPriceX96
    tick
  }
}`;

export const TOKEN_DAY_DATAS = `
query TokenDayDatas($tokenId: ID!, $first: Int!) {
  tokenDayDatas(where: { token: $tokenId }, orderBy: date, orderDirection: desc, first: $first) {
    date
    priceUSD
    volumeUSD
  }
}`;

export const RECENT_SWAPS = `
query RecentSwaps($poolId: ID!, $first: Int!) {
  swaps(where: { pool: $poolId }, orderBy: timestamp, orderDirection: desc, first: $first) {
    amount0
    amount1
    amountUSD
    sqrtPriceX96
    tick
    timestamp
  }
}`;

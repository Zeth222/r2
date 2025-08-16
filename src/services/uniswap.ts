import { requestGQL } from '../graph/client';
import { POSITIONS_BY_OWNER, POOL_DAY_DATAS } from '../graph/queries';
import { config } from '../config';
import { getTokenPriceUSD } from './prices';

export interface PositionWithData {
  id: string;
  liquidity: string;
  tickLower: { tickIdx: string };
  tickUpper: { tickIdx: string };
  pool: {
    id: string;
    feeTier: string;
    tick: string;
    sqrtPriceX96: string;
    token0: { id: string; symbol: string; decimals: string };
    token1: { id: string; symbol: string; decimals: string };
  };
  collectedFeesToken0: string;
  collectedFeesToken1: string;
  depositedToken0: string;
  depositedToken1: string;
  withdrawnToken0: string;
  withdrawnToken1: string;
}

export interface PositionMetrics extends PositionWithData {
  feesUSD: number;
  poolDayDatas: any[];
}

export async function fetchPositions(): Promise<PositionWithData[]> {
  let all: PositionWithData[] = [];
  let skip = 0;
  while (true) {
    const { positions } = await requestGQL<{ positions: PositionWithData[] }>(
      POSITIONS_BY_OWNER,
      { owner: config.WALLET_ADDRESS.toLowerCase(), first: 1000, skip }
    );
    all = all.concat(positions);
    if (positions.length < 1000) break;
    skip += positions.length;
  }
  return all;
}

export async function enrichPosition(pos: PositionWithData): Promise<PositionMetrics> {
  const price0 = await getTokenPriceUSD(pos.pool.token0.id);
  const price1 = await getTokenPriceUSD(pos.pool.token1.id);
  const fee0 = Number(pos.collectedFeesToken0) / 10 ** Number(pos.pool.token0.decimals);
  const fee1 = Number(pos.collectedFeesToken1) / 10 ** Number(pos.pool.token1.decimals);
  const feesUSD = fee0 * price0 + fee1 * price1;

  const { poolDayDatas } = await requestGQL<{ poolDayDatas: any[] }>(POOL_DAY_DATAS, {
    poolId: pos.pool.id,
    first: config.HISTORY_DAYS,
  });

  return { ...pos, feesUSD, poolDayDatas };
}

export function priceFromSqrtPrice(
  sqrtPriceX96: string,
  token0Decimals: number,
  token1Decimals: number
): number {
  const sqrt = Number(sqrtPriceX96) / 2 ** 96;
  const price = sqrt * sqrt * 10 ** (token0Decimals - token1Decimals);
  return price;
}

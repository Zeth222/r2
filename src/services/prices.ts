import { requestGQL } from '../graph/client';
import { TOKEN_DAY_DATAS } from '../graph/queries';

export async function getTokenPriceUSD(tokenId: string): Promise<number> {
  const { tokenDayDatas } = await requestGQL<{ tokenDayDatas: { priceUSD: string }[] }>(
    TOKEN_DAY_DATAS,
    { tokenId, first: 1 }
  );
  if (tokenDayDatas.length === 0) return 0;
  return Number(tokenDayDatas[0].priceUSD);
}

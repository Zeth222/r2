import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const schema = z.object({
  GRAPH_API_KEY: z.string(),
  UNISWAP_V3_ARBITRUM_SUBGRAPH_ID: z.string(),
  WALLET_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  TELEGRAM_TOKEN: z.string(),
  TELEGRAM_CHAT_ID: z.string(),
  POLL_INTERVAL_MS: z.coerce.number().default(60000),
  FEE_ALERT_USD: z.coerce.number().default(10),
  PRICE_MOVE_ALERT_PCT: z.coerce.number().default(3),
  RANGE_TICK_DISTANCE: z.coerce.number().default(50),
  VOLUME_SPIKE_MULT: z.coerce.number().default(2),
  TVL_SHIFT_PCT: z.coerce.number().default(10),
  HISTORY_DAYS: z.coerce.number().default(14),
  MAX_RETRIES: z.coerce.number().default(3),
  UTILIZA_TOKEN_USD: z.string().default('WETH,USDC')
});

export type Config = z.infer<typeof schema>;
export const config: Config = schema.parse(process.env);

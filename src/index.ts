import pino from 'pino';
import { config } from './config';
import { fetchPositions, enrichPosition, priceFromSqrtPrice } from './services/uniswap';
import { evaluateSignals } from './services/signals';
import { loadState, saveState } from '../store/state';
import { sendMessage } from './services/telegram';

const logger = pino({ level: 'info' });

async function startup() {
  const state = await loadState();
  const positions = await fetchPositions();
  const enriched = await Promise.all(positions.map(enrichPosition));
  let msg = '*Startup*\n';
  msg += `Posições: ${enriched.length}`;
  for (const p of enriched) {
    const price = priceFromSqrtPrice(
      p.pool.sqrtPriceX96,
      Number(p.pool.token0.decimals),
      Number(p.pool.token1.decimals)
    );
    msg += `\n• ${p.id} ${p.pool.token0.symbol}/${p.pool.token1.symbol} fee ${p.pool.feeTier} ticks [${p.tickLower.tickIdx},${p.tickUpper.tickIdx}] tick ${p.pool.tick} price ${price.toFixed(4)}`;
    state.positions[p.id] = { lastFeesUSD: p.feesUSD, lastTick: Number(p.pool.tick) };
  }
  await saveState(state);
  await sendMessage(msg);
  return state;
}

async function cycle(state: Awaited<ReturnType<typeof loadState>>) {
  const positions = await fetchPositions();
  const enriched = await Promise.all(positions.map(enrichPosition));
  let summary = '*Resumo*';
  for (const p of enriched) {
    const prev = state.positions[p.id];
    const result = evaluateSignals(p, prev, config);
    summary += `\n• ${p.id} fees $${p.feesUSD.toFixed(2)}`;
    if (result.alerts.length) {
      summary += ` – ${result.alerts.join(', ')}`;
    }
    state.positions[p.id] = { lastFeesUSD: result.feesUSD, lastTick: Number(p.pool.tick) };
  }
  await saveState(state);
  await sendMessage(summary);
}

async function main() {
  const state = await startup();
  logger.info('Bot iniciado');
  setInterval(() => {
    cycle(state).catch((err) => logger.error(err));
  }, config.POLL_INTERVAL_MS);
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});

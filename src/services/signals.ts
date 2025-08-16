import { Config } from '../config';
import { PositionState } from '../store/state';
import { PositionMetrics } from './uniswap';

export interface SignalResult {
  alerts: string[];
  feesUSD: number;
}

export function evaluateSignals(
  current: PositionMetrics,
  prev: PositionState | undefined,
  cfg: Config
): SignalResult {
  const alerts: string[] = [];
  const tick = Number(current.pool.tick);
  const lower = Number(current.tickLower.tickIdx);
  const upper = Number(current.tickUpper.tickIdx);
  const distLower = tick - lower;
  const distUpper = upper - tick;

  if (distLower <= cfg.RANGE_TICK_DISTANCE || distUpper <= cfg.RANGE_TICK_DISTANCE) {
    alerts.push('Tick perto da borda');
  }
  if (tick < lower || tick > upper) {
    alerts.push('Fora da faixa');
  }

  const dayDatas = current.poolDayDatas;
  if (dayDatas.length >= 2) {
    const price0 = Number(dayDatas[0].sqrtPriceX96);
    const price1 = Number(dayDatas[1].sqrtPriceX96);
    const ret = ((price0 - price1) / price1) * 100;
    if (Math.abs(ret) >= cfg.PRICE_MOVE_ALERT_PCT) {
      alerts.push(`Variação 24h ${ret.toFixed(2)}%`);
    }
    const volToday = Number(dayDatas[0].volumeUSD);
    const avgVol =
      dayDatas.slice(1).reduce((s, d) => s + Number(d.volumeUSD), 0) /
      Math.max(dayDatas.length - 1, 1);
    if (volToday > cfg.VOLUME_SPIKE_MULT * avgVol) {
      alerts.push('Volume spike');
    }
    const tvlToday = Number(dayDatas[0].tvlUSD);
    const tvlPrev = Number(dayDatas[1].tvlUSD);
    const tvlRet = ((tvlToday - tvlPrev) / tvlPrev) * 100;
    if (Math.abs(tvlRet) >= cfg.TVL_SHIFT_PCT) {
      alerts.push(`TVL shift ${tvlRet.toFixed(2)}%`);
    }
  }

  const prevFees = prev?.lastFeesUSD ?? 0;
  const deltaFees = current.feesUSD - prevFees;
  if (deltaFees >= cfg.FEE_ALERT_USD) {
    alerts.push(`Fees +$${deltaFees.toFixed(2)}`);
  }

  return { alerts, feesUSD: current.feesUSD };
}

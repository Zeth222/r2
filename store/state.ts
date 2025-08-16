import { promises as fs } from 'fs';
import path from 'path';

export interface PositionState {
  lastFeesUSD?: number;
  lastTick?: number;
  lastPriceUSD?: number;
  lastPoolDayDate?: number;
  lastAlerts?: Record<string, number>;
}

export interface State {
  positions: Record<string, PositionState>;
}

const statePath = path.join(process.cwd(), 'store', 'state.json');
let cache: State | null = null;

export async function loadState(): Promise<State> {
  if (cache) return cache;
  try {
    const data = await fs.readFile(statePath, 'utf8');
    cache = JSON.parse(data);
  } catch {
    cache = { positions: {} };
  }
  return cache;
}

export async function saveState(state: State) {
  cache = state;
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await fs.writeFile(statePath, JSON.stringify(state, null, 2));
}

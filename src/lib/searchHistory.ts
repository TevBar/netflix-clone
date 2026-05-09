// simple localStorage-backed search history with counts
export type SearchEntry = { q: string; count: number; lastSeen: number };

const KEY = 'netflix_clone_search_history';
const MAX = 10;

function read(): SearchEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SearchEntry[]) : [];
  } catch {
    return [];
  }
}

function write(entries: SearchEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    // ignore quota errors in demo
  }
}

export function addSearch(query: string) {
  if (!query?.trim()) return;
  const q = query.trim();
  const now = Date.now();
  const entries = read();
  const idx = entries.findIndex(e => e.q.toLowerCase() === q.toLowerCase());

  if (idx >= 0) {
    entries[idx].count += 1;
    entries[idx].lastSeen = now;
    const [item] = entries.splice(idx, 1);
    entries.unshift(item);
  } else {
    entries.unshift({ q, count: 1, lastSeen: now });
  }

  write(entries.slice(0, MAX));
}

export function getRecentSearches(): SearchEntry[] {
  return read().slice(0, MAX);
}

export function clearSearchHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

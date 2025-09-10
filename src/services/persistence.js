import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple versioned, namespaced local persistence and offline sync queue

const APP_STATE_VERSION = '1';
const ns = (key) => `medalert:v${APP_STATE_VERSION}:${key}`;

export const storage = {
  async get(key, fallback = null) {
    try {
      const raw = await AsyncStorage.getItem(ns(key));
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  async set(key, value) {
    try {
      await AsyncStorage.setItem(ns(key), JSON.stringify(value));
    } catch {}
  },
  async remove(key) {
    try { await AsyncStorage.removeItem(ns(key)); } catch {}
  },
  async clearAll(keys = []) {
    try {
      await AsyncStorage.multiRemove(keys.map(ns));
    } catch {}
  }
};

// Offline sync queue for remote persistence
// Each item: { id, type, payload, createdAt }
const QUEUE_KEY = 'syncQueue';

export const syncQueue = {
  async enqueue(item) {
    const queue = (await storage.get(QUEUE_KEY, [])) || [];
    const withId = { id: `${Date.now()}_${Math.random().toString(36).slice(2)}`, createdAt: Date.now(), ...item };
    queue.push(withId);
    await storage.set(QUEUE_KEY, queue);
    return withId;
  },
  async peekAll() {
    return (await storage.get(QUEUE_KEY, [])) || [];
  },
  async replaceAll(newQueue) {
    await storage.set(QUEUE_KEY, newQueue || []);
  },
  async clear() {
    await storage.set(QUEUE_KEY, []);
  }
};

// Flusher: attempts to send queued items to the server using provided dispatcher
// dispatcher: async (item) => { await apiCall(item); }
export async function flushQueue(dispatcher) {
  const queue = await syncQueue.peekAll();
  if (!queue.length) return { flushed: 0 };
  const remaining = [];
  let flushed = 0;
  for (const item of queue) {
    try {
      await dispatcher(item);
      flushed += 1;
    } catch (e) {
      // keep item if server failed or offline
      remaining.push(item);
    }
  }
  await syncQueue.replaceAll(remaining);
  return { flushed, remaining: remaining.length };
}



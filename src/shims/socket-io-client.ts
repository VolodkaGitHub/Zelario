type Handler = (...args: unknown[]) => void;

type IoOptions = {
  auth?:
    | Record<string, unknown>
    | ((cb: (data: Record<string, unknown>) => void) => void);
  transports?: string[];
  timeout?: number;
  forceNew?: boolean;
  autoConnect?: boolean;
  withCredentials?: boolean;
};

class MockSocket {
  connected = false;
  id = "demo-socket";
  private listeners = new Map<string, Handler[]>();

  private fire(event: string, ...args: unknown[]) {
    const handlers = this.listeners.get(event) ?? [];
    handlers.forEach((handler) => {
      try {
        handler(...args);
      } catch (e) {
        console.warn("[demo socket] handler error:", e);
      }
    });
  }

  connect() {
    if (this.connected) return this;
    this.connected = true;
    this.fire("connect");
    return this;
  }

  disconnect() {
    this.connected = false;
    this.fire("disconnect");
  }

  removeAllListeners(event?: string) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
    return this;
  }

  on(event: string, handler: Handler) {
    const list = this.listeners.get(event) ?? [];
    list.push(handler);
    this.listeners.set(event, list);
    if (event === "connect" && this.connected) {
      queueMicrotask(() => handler());
    }
    return this;
  }

  off(event: string, handler?: Handler) {
    if (!handler) {
      this.listeners.delete(event);
      return this;
    }
    const list = this.listeners.get(event) ?? [];
    this.listeners.set(
      event,
      list.filter((h) => h !== handler)
    );
    return this;
  }

  emit(event: string, ...args: unknown[]) {
    this.fire(event, ...args);
    return this;
  }
}

function resolveAuth(
  auth: IoOptions["auth"]
): Record<string, unknown> | undefined {
  if (!auth) return undefined;
  if (typeof auth !== "function") return auth;

  let payload: Record<string, unknown> | undefined;
  auth((data) => {
    payload = data;
  });
  return payload;
}

export function io(_url: string, opts?: IoOptions) {
  // Mirror socket.io: auth callback receives `cb` and calls cb({ token })
  resolveAuth(opts?.auth);

  const socket = new MockSocket();
  setTimeout(() => socket.connect(), 10);
  return socket;
}

export type Socket = MockSocket;

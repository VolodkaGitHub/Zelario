const noop = () => undefined;

type Tween = {
  kill: () => void;
  pause: () => void;
  play: () => void;
};

const tween = (): Tween => ({ kill: noop, pause: noop, play: noop });

type Timeline = Tween & {
  from: (..._args: unknown[]) => Timeline;
  fromTo: (..._args: unknown[]) => Timeline;
  to: (..._args: unknown[]) => Timeline;
};

function createTimeline(): Timeline {
  const tl = tween() as Timeline;
  tl.from = () => tl;
  tl.fromTo = () => tl;
  tl.to = () => tl;
  return tl;
}

function resolveScope(
  scope?: Element | { current?: Element | null } | object | null
): Element | undefined {
  if (!scope) return undefined;
  if (scope instanceof Element) return scope;
  if (
    typeof scope === "object" &&
    scope !== null &&
    "current" in scope &&
    scope.current instanceof Element
  ) {
    return scope.current;
  }
  return undefined;
}

function runContext(
  callback: () => void | (() => void),
  scope?: Element | { current?: Element | null } | object | null
): { revert: () => void } {
  void resolveScope(scope);
  let cleanup: void | (() => void);
  try {
    cleanup = callback();
  } catch (e) {
    console.warn("[demo gsap] animation callback error:", e);
  }
  return {
    revert: () => {
      if (typeof cleanup === "function") cleanup();
    },
  };
}

export const gsap = {
  to: (..._args: unknown[]) => tween(),
  from: (..._args: unknown[]) => tween(),
  fromTo: (..._args: unknown[]) => tween(),
  set: noop,
  timeline: (_opts?: unknown) => createTimeline(),
  registerPlugin: noop,

  context(
    callback: () => void | (() => void),
    scope?: Element | { current?: Element | null } | object | null
  ): { revert: () => void } {
    return runContext(callback, scope);
  },

  utils: {
    toArray<T extends Element = Element>(
      target: string | Element | Element[] | NodeList | null
    ): T[] {
      if (!target) return [];
      if (typeof target === "string") {
        const root =
          typeof document !== "undefined" ? document : null;
        return root
          ? (Array.from(root.querySelectorAll(target)) as T[])
          : [];
      }
      if (Array.isArray(target)) return target as T[];
      if (target instanceof NodeList) return Array.from(target) as T[];
      if (target instanceof Element) return [target as T];
      return [];
    },
  },
};

export const ScrollTrigger = {
  create: noop,
  refresh: noop,
  getAll: () => [] as unknown[],
};

export default gsap;

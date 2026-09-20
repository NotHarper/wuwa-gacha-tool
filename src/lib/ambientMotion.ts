/**
 * 氛围动效的可见性门控。
 *
 * 应用外壳里有一批常驻装饰动画（共振场的波形与轨道、背景等高线漂移、导航呼吸点、
 * 空状态轨道环等）。它们在窗口被最小化或失去焦点时没有任何观看价值，却会持续触发
 * 重绘与合成——其中共振场还叠了高斯模糊滤镜，在集显笔记本上是可观的持续耗电。
 *
 * 这里只负责判定「现在是否值得播放氛围动效」，并把结论写到 <html data-ambient>：
 *   - CSS 侧：`html[data-ambient='idle']` 把 `--ambient-play-state` 翻成 paused，
 *     靠继承分发给所有声明了 `animation-play-state: var(--ambient-play-state)` 的规则。
 *     用 paused 而不是 `animation: none` 是刻意的——它冻结在当前帧，恢复时原地续跑。
 *   - JS 侧：需要停掉 SMIL 或 rAF 循环的组件通过 useAmbientMotion 订阅。
 *
 * 恢复的可靠性优先于省电：判定链路上任何不确定的情况都倒向 active，
 * 并且 visibilitychange / focus / 指针进入 / 任意按键或点击都会重新判定，
 * 不存在只能进不能出的状态。
 */

const AMBIENT_ATTRIBUTE = 'data-ambient';

export type AmbientState = 'active' | 'idle';

let ambientState: AmbientState = 'active';
let pointerInside = false;
let installed = false;
const subscribers = new Set<() => void>();

function resolveAmbientState(): AmbientState {
  if (typeof document === 'undefined') return 'active';
  // 完全不可见（最小化、被遮挡、切到其它标签）时一定不需要播放。
  if (document.visibilityState === 'hidden') return 'idle';
  // 指针停在窗口内说明用户正在看着它，即使键盘焦点在别的窗口也要照常播放。
  if (pointerInside) return 'active';
  try {
    return document.hasFocus() ? 'active' : 'idle';
  } catch {
    // 取不到焦点状态时按 active 处理：宁可多跑一会儿动画，
    // 也不能让动画停在 idle 上恢复不回来。
    return 'active';
  }
}

function commit(next: AmbientState) {
  if (next === ambientState) return;
  ambientState = next;
  document.documentElement.setAttribute(AMBIENT_ATTRIBUTE, next);
  subscribers.forEach((notify) => notify());
}

function syncAmbientState() {
  commit(resolveAmbientState());
}

function handlePointerEnter() {
  pointerInside = true;
  syncAmbientState();
}

function handlePointerLeave() {
  pointerInside = false;
  syncAmbientState();
}

/** 在应用启动时调用一次。重复调用是安全的。 */
export function installAmbientMotionTracking() {
  if (installed || typeof document === 'undefined') return;
  installed = true;

  const root = document.documentElement;
  root.setAttribute(AMBIENT_ATTRIBUTE, ambientState);

  document.addEventListener('visibilitychange', syncAmbientState);
  window.addEventListener('focus', syncAmbientState);
  window.addEventListener('blur', syncAmbientState);
  // 从后台/前进后退缓存恢复时补一次判定。
  window.addEventListener('pageshow', syncAmbientState);

  // pointerenter/pointerleave 挂在根元素上只会在指针真正进出窗口时触发，
  // 不像挂在 document 上捕获那样每经过一个元素都要回调。
  root.addEventListener('pointerenter', handlePointerEnter);
  root.addEventListener('pointerleave', handlePointerLeave);

  // 真实交互一定意味着用户就在这里，作为恢复的最后兜底。
  window.addEventListener('pointerdown', syncAmbientState, true);
  window.addEventListener('keydown', syncAmbientState, true);

  syncAmbientState();
}

export function getAmbientState(): AmbientState {
  return ambientState;
}

export function isAmbientActive() {
  return ambientState === 'active';
}

export function subscribeAmbient(notify: () => void) {
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
  };
}

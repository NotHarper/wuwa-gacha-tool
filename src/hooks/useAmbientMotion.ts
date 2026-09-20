import { useSyncExternalStore } from 'react';
import { isAmbientActive, subscribeAmbient } from '../lib/ambientMotion';

/**
 * 订阅氛围动效是否应当播放。
 *
 * 只给「CSS 的 animation-play-state 管不到」的动效使用，目前是两类：
 *   - SVG SMIL（<animate>）：必须走 SVG 自己的时间轴 API；
 *   - framer-motion 的无限循环：由 JS 逐帧写属性，组件卸载才会停。
 *
 * 纯 CSS 动画不需要这个 hook，声明 `animation-play-state: var(--ambient-play-state)` 即可。
 */
export function useAmbientMotion() {
  return useSyncExternalStore(subscribeAmbient, isAmbientActive, () => true);
}

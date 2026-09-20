/** Toast 存活时长的唯一真值来源：计时器与进度条动画都从这里取。 */
export const TOAST_DURATION_MS = 3000;

/**
 * 同时可见的 Toast 上限。
 *
 * 失败路径上常见 `addToast('error', String(error))` 连续触发（例如批量同步里每个 UID
 * 各报一次），不设上限会一路堆到超出视口，把下方的内容全遮住。超出后丢弃最旧的一条。
 */
export const MAX_VISIBLE_TOASTS = 4;

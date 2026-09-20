import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ToastMessage } from '../types';
import { displaySensitiveText } from '../lib/shareMode';
import { TOAST_DURATION_MS } from '../lib/toast';
import ResonanceCloseButton from './ResonanceCloseButton';
import ResonanceIcon from './ResonanceModeIcon';

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

function ToastItem({ message, onRemove }: { message: ToastMessage; onRemove: (id: string) => void }) {
  const [paused, setPaused] = useState(false);
  // 剩余时长跨暂停保留，否则移开指针会重新从完整时长开始计。
  const remainingRef = useRef(TOAST_DURATION_MS);
  const resumedAtRef = useRef(0);

  const dismiss = useCallback(() => onRemove(message.id), [message.id, onRemove]);

  useEffect(() => {
    if (paused) return;
    resumedAtRef.current = Date.now();
    const timer = window.setTimeout(dismiss, remainingRef.current);
    return () => {
      window.clearTimeout(timer);
      remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - resumedAtRef.current));
    };
  }, [dismiss, paused]);

  return (
    <motion.div
      layout
      className="toast-card"
      data-tone={message.type}
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* success / error / info 同时是 ResonanceIcon 的 kind，直接复用。 */}
      <ResonanceIcon kind={message.type} size={19} className="toast-icon shrink-0" />
      <span className="min-w-0 flex-1 break-words text-sm text-tide">{displaySensitiveText(message.message)}</span>
      <ResonanceCloseButton onClick={dismiss} size="sm" />
      {/* 进度条时长由 TOAST_DURATION_MS 内联驱动，避免 CSS 里再写一遍同一个数字。 */}
      <div
        className="toast-progress absolute bottom-0 left-0 h-0.5"
        style={{ animationDuration: `${TOAST_DURATION_MS}ms` }}
      />
    </motion.div>
  );
}

export default function Toast({ messages, onRemove }: ToastProps) {
  return (
    // aria-live 让读屏软件播报成功/失败——这是很多操作唯一的结果反馈。
    <div
      className="toast-viewport"
      role="status"
      aria-live="polite"
      aria-atomic="false"
      aria-label="操作提示"
    >
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <ToastItem key={message.id} message={message} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

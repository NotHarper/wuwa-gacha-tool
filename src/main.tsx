import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { installAmbientMotionTracking } from './lib/ambientMotion';
import { installGlobalLogging } from './services/logger';
import './index.css';

installGlobalLogging();
installAmbientMotionTracking();

const NON_TEXT_INPUT_TYPES = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
]);

/**
 * 判断该位置是否应当放出浏览器原生右键菜单。
 *
 * 桌面应用整体屏蔽右键，是为了不暴露“重新加载/打印/查看源代码”这类与产品无关的项。
 * 但文本输入控件是例外：剪切、复制、粘贴、全选、撤销这些是用户实际会用到的能力，
 * 而应用自身没有提供替代入口，屏蔽掉等于白白拿走一块可用性。
 */
function allowsNativeContextMenu(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  const editable = target.closest<HTMLElement>('input, textarea, [contenteditable]');
  if (!editable) return false;
  if (editable instanceof HTMLTextAreaElement) return true;
  if (editable instanceof HTMLInputElement) return !NON_TEXT_INPUT_TYPES.has(editable.type);
  return editable.isContentEditable;
}

document.addEventListener('contextmenu', (event) => {
  if (allowsNativeContextMenu(event.target)) return;
  event.preventDefault();
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

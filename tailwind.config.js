/** @type {import('tailwindcss').Config} */

/*
 * 所有颜色都指向 src/index.css 的 :root token，这里不再重复维护一份 hex。
 * 通道形式（`31 31 31`）加 <alpha-value> 让 `bg-surface-card/60`、`text-gold/70`
 * 这类透明度修饰符继续可用；要换主题只需覆盖 CSS 变量，不必改这个文件。
 */
const withAlpha = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 基础灰阶
        abyss: {
          DEFAULT: withAlpha("--abyss-rgb"),
          50: withAlpha("--abyss-50-rgb"),
          100: withAlpha("--abyss-100-rgb"),
          200: withAlpha("--abyss-200-rgb"),
          300: withAlpha("--abyss-300-rgb"),
        },
        tide: {
          DEFAULT: withAlpha("--tide-rgb"),
          dim: withAlpha("--tide-dim-rgb"),
        },
        wave: {
          DEFAULT: withAlpha("--wave-rgb"),
          dim: withAlpha("--wave-dim-rgb"),
        },
        ember: withAlpha("--gold-deep-rgb"),
        mist: withAlpha("--mist-rgb"),
        foam: withAlpha("--foam-rgb"),

        // 表面层级
        surface: {
          DEFAULT: withAlpha("--surface-app-rgb"),
          sunken: withAlpha("--surface-sunken-rgb"),
          input: withAlpha("--surface-input-rgb"),
          card: withAlpha("--surface-card-rgb"),
          modal: withAlpha("--surface-modal-rgb"),
          raised: withAlpha("--surface-raised-rgb"),
        },

        // 语义色
        gold: {
          DEFAULT: withAlpha("--gold-rgb"),
          bright: withAlpha("--gold-bright-rgb"),
          soft: withAlpha("--gold-soft-rgb"),
          deep: withAlpha("--gold-deep-rgb"),
        },
        ok: {
          DEFAULT: withAlpha("--ok-rgb"),
          strong: withAlpha("--ok-strong-rgb"),
          soft: withAlpha("--ok-soft-rgb"),
        },
        danger: {
          DEFAULT: withAlpha("--danger-rgb"),
          strong: withAlpha("--danger-strong-rgb"),
          soft: withAlpha("--danger-soft-rgb"),
        },
        warn: {
          DEFAULT: withAlpha("--warn-rgb"),
          soft: withAlpha("--warn-soft-rgb"),
          border: withAlpha("--warn-border-rgb"),
        },
      },
      /*
       * 这里刻意不覆盖 borderRadius：Tailwind 自带的 sm/md/lg 已是一套一致的比例，
       * 而 --radius-* token 的取值与它不同，覆盖会让全项目的 rounded-md / rounded-lg
       * 悄悄改变尺寸。JSX 继续用 Tailwind 的圆角刻度，CSS 规则用 --radius-* token。
       */
      boxShadow: {
        card: "var(--shadow-card)",
        panel: "var(--shadow-panel)",
        popover: "var(--shadow-popover)",
        overlay: "var(--shadow-overlay)",
        modal: "var(--shadow-modal)",
      },
      transitionTimingFunction: {
        "out-expo": "var(--ease-out-expo)",
        standard: "var(--ease-standard)",
        accelerate: "var(--ease-accelerate)",
      },
      zIndex: {
        decor: "var(--z-decor)",
        sticky: "var(--z-sticky)",
        dropdown: "var(--z-dropdown)",
        "ambient-overlay": "var(--z-ambient-overlay)",
        modal: "var(--z-modal)",
        popover: "var(--z-popover)",
        summary: "var(--z-summary)",
        toast: "var(--z-toast)",
        tooltip: "var(--z-tooltip)",
      },
      fontFamily: {
        display: [
          "Exo 2",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Noto Sans",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

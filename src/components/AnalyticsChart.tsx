import { useEffect, useRef, useState } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
  AxisPointerComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 按需注册。漏注册的组件会让对应的 option 配置被静默丢弃：
// LegendComponent 缺失时，多系列折线图的 legend 不会渲染，几条线也就没了图例说明。
echarts.use([
  BarChart,
  LineChart,
  AxisPointerComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
  CanvasRenderer,
]);

interface AnalyticsChartProps {
  option: unknown;
  height: number;
  eager?: boolean;
  prewarmDelay?: number;
  onEvents?: Record<string, (params: unknown) => void>;
  /**
   * 图表的文字替代。canvas 渲染的内容对读屏软件是完全空白的，
   * 这里至少给出图表在讲什么，以及关键结论。
   */
  ariaLabel?: string;
}

type IdleWindow = Window & typeof globalThis & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export default function AnalyticsChart({ option, height, eager = false, prewarmDelay = 0, onEvents, ariaLabel }: AnalyticsChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(eager);

  useEffect(() => {
    if (ready) return;

    let active = true;
    let idleHandle: number | null = null;
    const idleWindow = window as IdleWindow;
    const activate = () => {
      if (active) setReady(true);
    };
    const scheduleIdle = () => {
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(activate, { timeout: 900 });
      } else {
        idleHandle = window.setTimeout(activate, 80);
      }
    };
    const timer = window.setTimeout(scheduleIdle, prewarmDelay);
    const observer = containerRef.current && 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) activate();
      }, { rootMargin: '900px 0px' })
      : null;

    if (observer && containerRef.current) observer.observe(containerRef.current);

    return () => {
      active = false;
      window.clearTimeout(timer);
      observer?.disconnect();
      if (idleHandle !== null) {
        if (idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(idleHandle);
        else window.clearTimeout(idleHandle);
      }
    };
  }, [prewarmDelay, ready]);

  return (
    <div
      ref={containerRef}
      style={{ minHeight: height }}
      aria-busy={!ready}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
    >
      {ready && (
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height }}
          notMerge
          lazyUpdate
          onEvents={onEvents}
        />
      )}
    </div>
  );
}

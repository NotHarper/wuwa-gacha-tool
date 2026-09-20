import { useEffect, useRef, useState } from 'react';

interface UseAnimatedCounterOptions {
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function useAnimatedCounter(
  target: number,
  options: UseAnimatedCounterOptions = {}
): number {
  const { duration = 1200, delay = 0, easing = easeOutExpo } = options;
  const [current, setCurrent] = useState(target);
  /*
   * 始终镜像当前显示值。
   *
   * 之前这里存的是「上一个动画完成时的目标值」，且只在跑满时才更新：一旦 target 在
   * 动画途中再次变化（导入完成后连续刷新就会），清理函数取消 rAF，下一轮的起点仍是
   * 过期的旧值，数字会先跳回去再重新爬升。改成镜像实际显示值后，被打断的动画从
   * 眼睛看到的位置继续。
   */
  const displayedRef = useRef(target);
  const animFrame = useRef<number>(0);

  useEffect(() => {
    const startValue = displayedRef.current;
    const diff = target - startValue;

    if (diff === 0) return;

    let startTime: number | null = null;
    const commit = (next: number) => {
      displayedRef.current = next;
      setCurrent(next);
    };

    const delayTimeout = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        commit(Math.round(startValue + diff * easing(progress)));

        if (progress < 1) animFrame.current = requestAnimationFrame(step);
      };

      animFrame.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      cancelAnimationFrame(animFrame.current);
    };
  }, [target, duration, delay, easing]);

  return current;
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  formatter?: (val: number) => string;
  shimmer?: boolean;
  /** 数值变化时触发柔和的白色光晕脉冲 */
  pulse?: boolean;
  /** 达到里程碑 [100, 500, 1000, 5000, 10000] 时触发金色庆祝，优先级高于 pulse */
  milestone?: boolean;
}

const MILESTONES = [100, 500, 1000, 5000, 10000];

export default function AnimatedCounter({
  value,
  duration = 1200,
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
  formatter,
  shimmer = false,
  pulse = false,
  milestone = false,
}: AnimatedCounterProps) {
  const animatedValue = useAnimatedCounter(value, { duration, delay });
  const displayValue = formatter ? formatter(animatedValue) : animatedValue.toLocaleString();

  /*
   * 脉冲种类和触发序号放在同一份状态里。
   *
   * 原来用一个永不复位的 ref 记「是否刚跨过里程碑」，结果第一次跨过之后，
   * 后续每一次普通数值变化都会继续播金色庆祝动画。
   */
  const [pulseState, setPulseState] = useState<{ key: number; kind: 'pulse' | 'milestone' } | null>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === value) return;
    const oldValue = prevValue.current;
    prevValue.current = value;

    if (milestone && MILESTONES.some((threshold) => value >= threshold && oldValue < threshold)) {
      setPulseState((current) => ({ key: (current?.key ?? 0) + 1, kind: 'milestone' }));
      return;
    }

    if (pulse) {
      setPulseState((current) => ({ key: (current?.key ?? 0) + 1, kind: 'pulse' }));
    }
  }, [value, pulse, milestone]);

  const animationClass = pulseState
    ? pulseState.kind === 'milestone' ? 'number-milestone' : 'number-pulse'
    : '';

  return (
    // key 变化强制重挂载，用于重放 CSS 动画。
    <span
      key={pulseState?.key ?? 0}
      className={`${shimmer ? `${className} number-shimmer` : className} ${animationClass}`}
    >
      {prefix}{displayValue}{suffix}
    </span>
  );
}

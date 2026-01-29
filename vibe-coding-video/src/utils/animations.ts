import { interpolate, spring, Easing } from "remotion";

/**
 * Bouncy entrance animation - scale from 0 to 1 with overshoot
 */
export function springIn({
  frame,
  fps,
  delay = 0,
}: {
  frame: number;
  fps: number;
  delay?: number;
}): number {
  return spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 12,
      stiffness: 200,
      mass: 0.8,
    },
  });
}

/**
 * Slide from left animation
 */
export function slideFromLeft({
  frame,
  fps,
  delay = 0,
  distance = 200,
}: {
  frame: number;
  fps: number;
  delay?: number;
  distance?: number;
}): number {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 14,
      stiffness: 180,
      mass: 0.7,
    },
  });
  return interpolate(progress, [0, 1], [-distance, 0]);
}

/**
 * Slide from right animation
 */
export function slideFromRight({
  frame,
  fps,
  delay = 0,
  distance = 200,
}: {
  frame: number;
  fps: number;
  delay?: number;
  distance?: number;
}): number {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 14,
      stiffness: 180,
      mass: 0.7,
    },
  });
  return interpolate(progress, [0, 1], [distance, 0]);
}

/**
 * Letter-by-letter stagger animation - returns opacity for each letter
 */
export function staggerText({
  frame,
  fps,
  letterIndex,
  totalLetters,
  delay = 0,
  staggerDelay = 2,
}: {
  frame: number;
  fps: number;
  letterIndex: number;
  totalLetters: number;
  delay?: number;
  staggerDelay?: number;
}): { opacity: number; translateY: number } {
  const letterDelay = delay + letterIndex * staggerDelay;
  const progress = spring({
    frame: frame - letterDelay,
    fps,
    config: {
      damping: 15,
      stiffness: 250,
      mass: 0.5,
    },
  });
  return {
    opacity: progress,
    translateY: interpolate(progress, [0, 1], [20, 0]),
  };
}

/**
 * Fade + blur combination
 */
export function fadeBlur({
  frame,
  fps,
  delay = 0,
  fadeIn = true,
}: {
  frame: number;
  fps: number;
  delay?: number;
  fadeIn?: boolean;
}): { opacity: number; blur: number } {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 20,
      stiffness: 120,
      mass: 1,
    },
  });
  const direction = fadeIn ? progress : 1 - progress;
  return {
    opacity: direction,
    blur: interpolate(direction, [0, 1], [10, 0]),
  };
}

/**
 * Animated number counter for rankings
 */
export function countUp({
  frame,
  fps,
  target,
  delay = 0,
  duration = 15,
}: {
  frame: number;
  fps: number;
  target: number;
  delay?: number;
  duration?: number;
}): number {
  const adjustedFrame = frame - delay;
  if (adjustedFrame <= 0) return 0;
  const progress = interpolate(adjustedFrame, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(progress * target);
}

/**
 * Fade out animation for exits
 */
export function fadeOut({
  frame,
  startFrame,
  duration = 10,
}: {
  frame: number;
  startFrame: number;
  duration?: number;
}): number {
  if (frame < startFrame) return 1;
  return interpolate(frame, [startFrame, startFrame + duration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
}

/**
 * Scale up entrance
 */
export function scaleUp({
  frame,
  fps,
  delay = 0,
}: {
  frame: number;
  fps: number;
  delay?: number;
}): number {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 10,
      stiffness: 150,
      mass: 0.6,
    },
  });
  return interpolate(progress, [0, 1], [0.3, 1]);
}

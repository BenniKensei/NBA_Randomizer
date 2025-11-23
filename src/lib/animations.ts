// Animation utilities using anime.js
import { animate, stagger } from 'animejs';

/**
 * Animate elements with stagger effect
 */
export const staggerFadeIn = (
  targets: HTMLElement | HTMLElement[] | HTMLCollection,
  options?: {
    delay?: number;
    duration?: number;
    easing?: string;
  }
) => {
  return animate(targets, {
    opacity: [0, 1],
    translateY: [30, 0],
    delay: stagger(options?.delay || 200),
    duration: options?.duration || 800,
    easing: options?.easing || 'easeOutExpo'
  });
};

/**
 * Bounce scale animation
 */
export const bounceScale = (
  target: HTMLElement,
  options?: {
    scale?: [number, number, number];
    duration?: number;
    easing?: string;
  }
) => {
  return animate(target, {
    scale: options?.scale || [1, 0.95, 1],
    duration: options?.duration || 300,
    easing: options?.easing || 'easeOutElastic(1, .8)'
  });
};

/**
 * Pop-in animation for grid items
 */
export const popInGrid = (
  targets: HTMLElement | HTMLElement[] | HTMLCollection,
  options?: {
    from?: 'first' | 'center' | 'last';
    delay?: number;
    duration?: number;
  }
) => {
  return animate(targets, {
    scale: [0, 1],
    opacity: [0, 1],
    delay: stagger(options?.delay || 80, { from: options?.from || 'center' }),
    duration: options?.duration || 500,
    easing: 'spring(1, 80, 10, 0)'
  });
};

/**
 * Card reveal animation with elastic bounce
 */
export const cardReveal = (
  targets: HTMLElement | HTMLElement[] | HTMLCollection,
  options?: {
    delay?: number;
    duration?: number;
  }
) => {
  return animate(targets, {
    scale: [0.8, 1],
    opacity: [0, 1],
    translateY: [20, 0],
    delay: stagger(options?.delay || 150),
    duration: options?.duration || 600,
    easing: 'easeOutElastic(1, .6)'
  });
};

/**
 * Button press animation
 */
export const buttonPress = (
  target: HTMLElement,
  options?: {
    scale?: number;
    duration?: number;
  }
) => {
  return animate(target, {
    scale: [1, options?.scale || 0.92, 1],
    duration: options?.duration || 200,
    easing: 'easeOutCubic'
  });
};

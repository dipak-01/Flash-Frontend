import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCurrentYear = () => new Date().getFullYear();

export function getRandomPatternStyle(seed: string) {
  const colors = [
    ['#FF5733', '#FFB533'],
    ['#33FF57', '#33FFB5'],
    ['#3357FF', '#33B5FF'],
    ['#B533FF', '#FF33F5'],
    ['#FF3333', '#FF8533'],
  ];

  // Generate a consistent index based on the seed string
  const colorIndex = Math.abs(seed.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0)) % colors.length;

  return {
    background: `linear-gradient(45deg, ${colors[colorIndex][0]}, ${colors[colorIndex][1]})`,
    color: '#ffffff',
  };
}

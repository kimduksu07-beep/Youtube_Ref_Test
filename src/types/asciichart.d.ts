declare module 'asciichart' {
  export interface PlotConfig {
    height?: number;
    width?: number;
    colors?: number[];
  }

  export function plot(series: number | number[], config?: PlotConfig): string;

  export const blue: number;
  export const green: number;
  export const red: number;
  export const yellow: number;
}

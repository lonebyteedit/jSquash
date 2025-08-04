export interface QuantizeOptions {
  maxNumColors: number;
  dither: number;
}

export const defaultOptions: QuantizeOptions = {
  maxNumColors: 256,
  dither: 1.0,
};
export interface QuantizerModule extends EmscriptenWasm.Module {
  quantize(
    data: BufferSource,
    width: number,
    height: number,
    numColors: number,
    dither: number,
  ): Uint8ClampedArray;
}

declare var moduleFactory: EmscriptenWasm.ModuleFactory<QuantizerModule>;

export default moduleFactory;

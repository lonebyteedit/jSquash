import { defaultOptions, QuantizeOptions } from './meta';
import ImageQuantModuleFactory, { QuantizerModule } from './codec/imagequant';

let modulePromise: Promise<QuantizerModule> | undefined;

async function getModule(): Promise<QuantizerModule> {
  if (modulePromise) {
    return modulePromise;
  }

  modulePromise = new Promise(async (resolve, reject) => {
    try {
      console.log('Initializing imagequant WASM module...');
      
      const module = await ImageQuantModuleFactory({
        locateFile: (path: string) => {
          return new URL(`./codec/${path}`, import.meta.url).href;
        },
      });

      console.log('imagequant WASM module initialized successfully.');
      resolve(module);
    } catch (error) {
      console.error('Failed to initialize imagequant WASM module:', error);
      modulePromise = undefined; 
      reject(error);
    }
  });

  return modulePromise;
}

export default async function quantize(
    data: ImageData,
    options: Partial<QuantizeOptions> = {}
): Promise<ImageData> {
    const module = await getModule();

    const _options = { ...defaultOptions, ...options };

    const result = module.quantize(
        data.data,
        data.width,
        data.height,
        _options.maxNumColors,
        _options.dither
    );

    return new ImageData(result, data.width, data.height);
}

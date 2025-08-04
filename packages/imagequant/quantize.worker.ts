// quantize.worker.ts - IMPORTANT: This file is part of a GPL-licensed module.
// It should only be loaded in a separate worker thread.

import quantize from './_quantize.js';

self.onmessage = async (event: MessageEvent) => {
  const { id, imageData, options } = event.data;

  try {
    const result = await quantize(imageData, options);
    const workerScope = self as unknown as DedicatedWorkerGlobalScope;
    workerScope.postMessage({ id, success: true, result }, [result.data.buffer]);
  } catch (error: any) {
    self.postMessage({ id, success: false, error: error.message });
  }
};

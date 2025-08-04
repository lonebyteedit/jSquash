/**
 * @license
 * Copyright 2023 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { QuantizeOptions } from './meta';

import QuantizerWorker from './quantize.worker.js?worker';

// This is a trick to get the URL of the worker script without causing a direct dependency.
// Rollup/Vite/etc. will bundle the worker and give us its final URL.
let worker: Worker | null = null;
let nextId = 0;

function getWorker(): Worker {
  if (!worker) {
    worker = new QuantizerWorker();
  }
  return worker;
}


export default function quantize(imageData: ImageData, options: Partial<QuantizeOptions> = {}): Promise<ImageData> {
  const worker = getWorker();
  const id = nextId++;

  return new Promise((resolve, reject) => {
    const onMessage = (event: MessageEvent) => {
      if (event.data.id !== id) return;

      worker.removeEventListener('message', onMessage);
      if (event.data.success) {
        resolve(event.data.result);
      } else {
        reject(new Error(event.data.error));
      }
    };

    worker.addEventListener('message', onMessage);

    // Transfer the ArrayBuffer to the worker for performance.
    worker.postMessage({ id, imageData, options }, [imageData.data.buffer]);
  });
}

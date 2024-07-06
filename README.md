## README

# Node.js Streaming Application

This project demonstrates a Node.js application that streams gigabytes of data to the frontend without blocking the event loop. The application supports pausing and resuming the stream, and allows for additional network requests and other operations while streaming is ongoing.

## Features

- **Non-blocking Event Loop**: Streams data without blocking the main event loop, ensuring the application remains responsive.
- **Pause and Resume**: Ability to pause and resume the stream.
- **Concurrent Operations**: Supports additional network requests and operations concurrently with streaming.

## Prerequisites

- Node.js (v16.0.0 or later)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/isaac-svg/processing_data_with_streams_api.git
   cd directory
   npm install
  node index.js

```
```js
// stream.js
import csvtojson from "csvtojson";
import { Readable, Transform, Writable } from "node:stream";
import { TransformStream } from "node:stream/web";
import { setTimeout } from "node:timers/promises";
import { createReadStream } from "node:fs";

export async function streamData(response) {
    const fileName = "./data/animeflv.csv";
    const fileStream = createReadStream(fileName);
    const abortController = new AbortController();

    await Readable.toWeb(fileStream)
        .pipeThrough(Transform.toWeb(csvtojson()))
        .pipeThrough(new TransformStream({
            async transform(jsonLine, controller) {
                const data = JSON.parse(Buffer.from(jsonLine));
                const mappedData = JSON.stringify({
                    title: data.title,
                    description: data.description,
                    url: data.url_anime
                });
                await setTimeout(() => {}, 200);
                controller.enqueue(mappedData.concat('\n'));
            }
        }))
        .pipeTo(Writable.toWeb(response), { signal: abortController.signal });
}

```

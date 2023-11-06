import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { Readable, Transform, Writable } from 'node:stream'
import { TransformStream } from 'node:stream/web'
import { setTimeout } from 'node:timers/promises'
import { stat } from 'node:fs/promises'
import csvtojson from 'csvtojson'
const PORT = 3000

createServer(async (request, response) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, headers)
    response.end()
    return
  }

  let items = 0
  const abortController = new AbortController()
  request.once('close', _ => {
    console.log(`connection was closed!`, items)
    abortController.abort()
  })

  try {
    const filename = './data/animeflv.csv'
    response.writeHead(200, headers)

   

    const fileStream = createReadStream(filename)

    await Readable.toWeb(fileStream)
      .pipeThrough(
        Transform.toWeb(csvtojson(
          { headers: ['title', 'description', 'url_anime'] }
        ))
      )
      .pipeThrough(
        new TransformStream({
          async transform(chunk, controller) {
            const data = JSON.parse(Buffer.from(chunk))
            const mappedData = {
              title: data.title,
              description: data.description,
              url_anime: data.url_anime
            }


            items++
            controller.enqueue(JSON.stringify(mappedData).concat('\n'))
          }
        })
      )
      .pipeTo(
        Writable.toWeb(response),
        {
          signal: abortController.signal
        }
      )

  } catch (error) {
    if (!error.message.includes('abort')) throw error
  }

})
  .listen(PORT)
  .on('listening', _ => console.log(`server is running at ${PORT}`))
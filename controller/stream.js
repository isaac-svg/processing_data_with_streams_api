import csvtojson  from "csvtojson"
import {Readable, Transform, Writable} from "node:stream"
import {TransformStream} from "node:stream/web"
import {setTimeout} from "node:timers/promises"
import { createReadStream } from "node:fs"

export async function streamData( response){
    const fileName = "./data/animeflv.csv"
    const fileStream = createReadStream(fileName);
    const abortController = new AbortController()

    await Readable.toWeb(fileStream).pipeThrough(
        Transform.toWeb(csvtojson())
    ).pipeThrough(
       new TransformStream(
        {
            async transform(jsonLine, controller){
            const data =  JSON.parse(Buffer.from(jsonLine));
            const mappedData = JSON.stringify({
                title:data.title,
                description:data.description,
                url: data.url_anime
            })
            // timer++;
            await setTimeout(()=>{},200)
            controller.enqueue(mappedData.concat('\n'))
            }
        }
       )
    ).
    pipeTo(Writable.toWeb(response),{
        signal:abortController.signal
    })

}
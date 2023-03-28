import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

export async function OpenAIStream(payload) {
  const encoder = new TextEncoder();

  const decoder = new TextDecoder();

  let counter = 0;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "What is OpenAPI?",
        },
      ],
    }),

    // body: JSON.stringify(payload),
  });
  console.log("res:", res ? res : "no response");

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();

            return;
          }

          try {
            const json = JSON.parse(data);

            const text = json.choices[0].text;

            const queue = encoder.encode(text);

            controller.enqueue(queue);

            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks

      // this ensures we properly read chunks & invoke an event for each SSE event stream

      const parser = createParser(onParse);

      // https://web.dev/streams/#asynchronous-iteration

      for await (const chunk of res.body as any) {
        // console.log("chunk", decoder.decode(chunk));
        let chunkContent = decoder.decode(chunk);
        console.log("chunkContent:", chunkContent);
        let jsonData;
        try {
          const jsonMatch = chunkContent.match(/\{.*\}/);
          jsonData = JSON.parse(jsonMatch[0]);
        } catch (error) {
          console.log("JSON parse error:", error);
        }
        console.log(
          "chunk",
          jsonData?.choices[0]?.delta.content
            ? jsonData.choices[0]?.delta.content
            : "no content"
        );
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}

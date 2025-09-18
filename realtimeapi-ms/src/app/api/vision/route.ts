import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { prompt, image, stream = false } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), { status: 500 });
    }
    if (!image) {
      return new Response(JSON.stringify({ error: 'Missing image' }), { status: 400 });
    }

    const input = [
      {
        role: 'user',
        content: [
          { type: 'input_text', text: prompt || 'Analyze this medical image and explain key findings.' },
          { type: 'input_image', image_url: image }
        ]
      }
    ];

    const body = {
      model: 'gpt-4o',
      input,
      temperature: 0.2,
      top_p: 1,
      stream: !!stream
    } as any;

    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ error: 'OpenAI API error', details: text }), { status: res.status });
    }

    if (stream) {
      // Parse SSE stream and extract only the text content
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      
      const stream = new ReadableStream({
        async start(controller) {
          if (!reader) {
            controller.close();
            return;
          }
          
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');
              
              for (const line of lines) {
                if (line.startsWith('data: ') && !line.includes('event:')) {
                  try {
                    const jsonStr = line.slice(6); // Remove 'data: '
                    if (jsonStr && jsonStr !== '[DONE]') {
                      const data = JSON.parse(jsonStr);
                      
                      // Extract text from various possible structures
                      let text = '';
                      if (data.type === 'response.output_text.delta' && data.delta) {
                        text = data.delta;
                      } else if (data.choices?.[0]?.delta?.content) {
                        text = data.choices[0].delta.content;
                      } else if (data.content?.[0]?.text) {
                        text = data.content[0].text;
                      }
                      
                      if (text) {
                        controller.enqueue(new TextEncoder().encode(text));
                      }
                    }
                  } catch (parseError) {
                    // Skip invalid JSON
                  }
                }
              }
            }
          } catch (error) {
            console.error('Stream parsing error:', error);
          } finally {
            controller.close();
          }
        }
      });

      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      const data = await res.json();
      // Try to resolve output text across possible shapes
      let outputText = '' as string;
      if (Array.isArray((data as any)?.output_text)) {
        outputText = (data as any).output_text.join('\n');
      } else if (typeof (data as any)?.output_text === 'string') {
        outputText = (data as any).output_text;
      } else if ((data as any)?.choices?.[0]?.message?.content) {
        outputText = (data as any).choices[0].message.content;
      } else if ((data as any)?.data?.[0]?.content) {
        outputText = (data as any).data[0].content;
      } else {
        outputText = 'No output received from model.';
      }
      return new Response(JSON.stringify({ output_text: outputText, raw: data }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Internal error', details: e?.message || String(e) }), { status: 500 });
  }
}

export function GET() {
  return new Response('Method Not Allowed', { status: 405 });
}



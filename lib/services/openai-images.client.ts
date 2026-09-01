/** Server-side OpenAI image generation — do not import from client components. */

export type OpenAIImageResult = {
  buffer: Buffer;
  mimeType: string;
};

const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';

export async function generateOpenAIImage(prompt: string): Promise<OpenAIImageResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const model = process.env.OPENAI_IMAGE_MODEL ?? 'dall-e-3';
  const size = model === 'dall-e-3' ? '1792x1024' : '1024x1024';

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size,
      response_format: 'b64_json',
      quality: 'hd',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('[openai-images] generation failed', response.status, body);
    throw new Error('Image generation failed');
  }

  const json = (await response.json()) as {
    data?: Array<{ b64_json?: string }>;
  };

  const b64 = json.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error('Image generation returned no data');
  }

  return {
    buffer: Buffer.from(b64, 'base64'),
    mimeType: 'image/png',
  };
}

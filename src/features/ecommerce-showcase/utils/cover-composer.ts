import sharp from 'sharp';
import { encodeCover } from './image-pipeline';

async function roundedRect(width: number, height: number, radius: number, fill: string): Promise<Buffer> {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" rx="${radius}" fill="${fill}"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

export async function composeCoverMockup(options: {
  desktopScreenshot: Buffer;
  mobileScreenshot?: Buffer | null;
}): Promise<Buffer> {
  const width = 1600;
  const height = 1000;
  const hasPhone = Boolean(options.mobileScreenshot);
  const laptopW = hasPhone ? 1080 : 1280;
  const laptopH = hasPhone ? 720 : 780;
  const laptopX = hasPhone ? 70 : 160;
  const laptopY = hasPhone ? 150 : 110;
  const bar = 36;

  const background = await sharp({
    create: { width, height, channels: 3, background: { r: 238, g: 242, b: 246 } },
  })
    .png()
    .toBuffer();

  const chrome = await roundedRect(laptopW, laptopH, 18, '#111827');
  const screen = await sharp(options.desktopScreenshot)
    .resize({ width: laptopW - 8, height: laptopH - bar - 8, fit: 'cover', position: 'top' })
    .png()
    .toBuffer();

  const composites: Array<{ input: Buffer; left: number; top: number }> = [
    { input: chrome, left: laptopX, top: laptopY },
    { input: screen, left: laptopX + 4, top: laptopY + bar },
  ];

  if (options.mobileScreenshot) {
    const phoneW = 280;
    const phoneH = 580;
    const phoneX = 1220;
    const phoneY = 250;
    const frame = await roundedRect(phoneW, phoneH, 28, '#111827');
    const phoneScreen = await sharp(options.mobileScreenshot)
      .resize({ width: phoneW - 20, height: phoneH - 40, fit: 'cover', position: 'top' })
      .png()
      .toBuffer();
    composites.push({ input: frame, left: phoneX, top: phoneY });
    composites.push({ input: phoneScreen, left: phoneX + 10, top: phoneY + 24 });
  }

  return sharp(background).composite(composites).png().toBuffer();
}

export async function composeAndEncodeCover(options: {
  desktopScreenshot: Buffer;
  mobileScreenshot?: Buffer | null;
}) {
  const composed = await composeCoverMockup(options);
  const encoded = await encodeCover(composed);
  return { composed, encoded };
}

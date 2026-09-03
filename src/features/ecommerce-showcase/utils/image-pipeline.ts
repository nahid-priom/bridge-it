import sharp from 'sharp';
import { IMAGE_TARGETS } from '../config/constants';

export type EncodedImage = {
  avif: Buffer;
  webp: Buffer;
  width: number;
  height: number;
};

export type ProcessedShowcaseImage = {
  original: Buffer;
  originalContentType: string;
  desktop: EncodedImage;
  thumbnail: EncodedImage;
  mobile?: EncodedImage;
};

type SharpPipeline = ReturnType<typeof sharp>;

function encodePair(pipeline: SharpPipeline, quality: number): Promise<{ avif: Buffer; webp: Buffer }> {
  return Promise.all([
    pipeline.clone().avif({ quality, effort: 4 }).toBuffer(),
    pipeline.clone().webp({ quality: Math.min(quality + 8, 86), effort: 4 }).toBuffer(),
  ]).then(([avif, webp]) => ({ avif, webp }));
}

async function fitInside(input: Buffer, maxWidth: number, quality: number): Promise<EncodedImage> {
  const fitted = sharp(input, { failOn: 'none' }).rotate().resize({
    width: maxWidth,
    withoutEnlargement: true,
    fit: 'inside',
  });
  const meta = await fitted.clone().metadata();
  const encoded = await encodePair(fitted, quality);
  return {
    ...encoded,
    width: meta.width ?? maxWidth,
    height: meta.height ?? Math.round(maxWidth * 0.7),
  };
}

export async function processShowcaseImage(
  input: Buffer,
  contentType = 'image/png'
): Promise<ProcessedShowcaseImage> {
  const original = await sharp(input, { failOn: 'none' }).rotate().toBuffer();
  const desktop = await fitInside(original, IMAGE_TARGETS.desktop.width, IMAGE_TARGETS.desktop.quality);
  const thumbnail = await fitInside(original, IMAGE_TARGETS.thumbnail.width, IMAGE_TARGETS.thumbnail.quality);
  const shouldMobile = desktop.width > 1100;
  const mobile = shouldMobile
    ? await fitInside(original, IMAGE_TARGETS.mobile.width, IMAGE_TARGETS.mobile.quality)
    : undefined;

  return {
    original,
    originalContentType: contentType,
    desktop,
    thumbnail,
    mobile,
  };
}

export async function encodeCover(input: Buffer): Promise<EncodedImage> {
  return fitInside(input, IMAGE_TARGETS.cover.width, IMAGE_TARGETS.cover.quality);
}

export async function rasterizeSvg(svg: string, width: number): Promise<Buffer> {
  return sharp(Buffer.from(svg))
    .resize({ width, withoutEnlargement: false, fit: 'inside' })
    .png()
    .toBuffer();
}

import sharp from 'sharp';
import { SOFTWARE_IMAGE_TARGETS } from '../config/constants';

export type EncodedAvif = {
  buffer: Buffer;
  width: number;
  height: number;
  contentType: 'image/avif';
};

type EncodeOptions = {
  width: number;
  quality: number;
  maxBytes?: number;
};

async function encodeAvif(input: Buffer, options: EncodeOptions): Promise<EncodedAvif> {
  const base = sharp(input, { failOn: 'none' }).rotate().resize({
    width: options.width,
    withoutEnlargement: true,
    fit: 'inside',
  });

  const meta = await base.clone().metadata();
  const width = meta.width ?? options.width;
  const height = meta.height ?? Math.round(options.width * 0.7);

  let quality = options.quality;
  let buffer = await base.clone().avif({ quality, effort: 5 }).toBuffer();

  if (options.maxBytes) {
    while (buffer.byteLength > options.maxBytes && quality > 28) {
      quality = Math.max(28, quality - 6);
      buffer = await base.clone().avif({ quality, effort: 5 }).toBuffer();
    }
  }

  return {
    buffer,
    width,
    height,
    contentType: 'image/avif',
  };
}

/** Cover card (~720w) targeting under 50KB. */
export async function encodeCoverCard(input: Buffer): Promise<EncodedAvif> {
  const t = SOFTWARE_IMAGE_TARGETS.coverCard;
  return encodeAvif(input, { width: t.width, quality: t.quality, maxBytes: t.maxBytes });
}

/** Cover detail (~1200w). */
export async function encodeCoverDetail(input: Buffer): Promise<EncodedAvif> {
  const t = SOFTWARE_IMAGE_TARGETS.coverDetail;
  return encodeAvif(input, { width: t.width, quality: t.quality });
}

/** Screen preview (~960w). */
export async function encodeScreenPreview(input: Buffer): Promise<EncodedAvif> {
  const t = SOFTWARE_IMAGE_TARGETS.screenPreview;
  return encodeAvif(input, { width: t.width, quality: t.quality });
}

/** Screen thumb (~480w) targeting under 35KB. */
export async function encodeScreenThumb(input: Buffer): Promise<EncodedAvif> {
  const t = SOFTWARE_IMAGE_TARGETS.screenThumb;
  return encodeAvif(input, { width: t.width, quality: t.quality, maxBytes: t.maxBytes });
}

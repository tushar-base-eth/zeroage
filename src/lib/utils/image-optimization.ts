import sharp from 'sharp';

export async function optimizeImage(
  buffer: Buffer,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'webp' | 'avif';
  } = {}
) {
  const {
    width,
    height,
    quality = 80,
    format = 'webp'
  } = options;

  let pipeline = sharp(buffer);

  // Resize if dimensions provided
  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  // Convert to specified format with quality
  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
  }

  return pipeline.toBuffer();
}

export function generateBlurDataURL(buffer: Buffer): Promise<string> {
  return sharp(buffer)
    .resize(8, 8, { fit: 'inside' })
    .toBuffer()
    .then((resizedBuffer) => {
      return `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`;
    });
}

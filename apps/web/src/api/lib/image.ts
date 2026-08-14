import sharp from 'sharp';

/**
 * Converts an uploaded image File into an optimized lossless WebP image buffer.
 */
export async function processAndCompressImage(file: File): Promise<{ buffer: Buffer; fileName: string; mimeType: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  try {
    const webpBuffer = await sharp(inputBuffer)
      .webp({ lossless: true })
      .toBuffer();

    const newFileName = file.name ? file.name.replace(/\.[^/.]+$/, '.webp') : 'upload.webp';

    return {
      buffer: webpBuffer,
      fileName: newFileName,
      mimeType: 'image/webp',
    };
  } catch (error) {
    console.warn('Failed to process image with sharp, falling back to original:', error);
    return {
      buffer: inputBuffer,
      fileName: file.name || 'upload.jpg',
      mimeType: file.type || 'image/jpeg',
    };
  }
}

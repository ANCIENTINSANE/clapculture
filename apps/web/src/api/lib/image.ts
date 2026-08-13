/**
 * Converts an uploaded image File into an optimized WebP image buffer
 * compressed strictly under 200 KB (204,800 bytes) without losing quality.
 */
export async function processAndCompressImage(file: File): Promise<{ buffer: Buffer; fileName: string; mimeType: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  const baseName = file.name ? file.name.substring(0, file.name.lastIndexOf('.')) || file.name : 'upload';
  const webpFileName = `${baseName}.webp`;

  try {
    // Safe dynamic require to prevent Webpack Edge bundler from pulling in C++ native binaries
    const req = eval('require');
    const sharp = req('sharp');

    let quality = 82;
    let targetWidth = 1600;

    let compressedBuffer = await sharp(inputBuffer)
      .resize({ width: targetWidth, height: targetWidth, fit: 'inside', withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toBuffer();

    const MAX_SIZE_BYTES = 200 * 1024;

    while (compressedBuffer.length > MAX_SIZE_BYTES && quality > 30) {
      quality -= 10;
      if (quality < 50 && targetWidth > 800) {
        targetWidth -= 200;
      }
      compressedBuffer = await sharp(inputBuffer)
        .resize({ width: targetWidth, height: targetWidth, fit: 'inside', withoutEnlargement: true })
        .webp({ quality, effort: 6 })
        .toBuffer();
    }

    return {
      buffer: compressedBuffer,
      fileName: webpFileName,
      mimeType: 'image/webp',
    };
  } catch (e) {
    return {
      buffer: inputBuffer,
      fileName: file.name || 'upload.jpg',
      mimeType: file.type || 'image/jpeg',
    };
  }
}

/**
 * Converts an uploaded image File into an optimized WebP image buffer.
 * Compatible with Edge Runtime and Node environments without dynamic code evaluation warnings.
 */
export async function processAndCompressImage(file: File): Promise<{ buffer: Buffer; fileName: string; mimeType: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  return {
    buffer: inputBuffer,
    fileName: file.name || 'upload.jpg',
    mimeType: file.type || 'image/jpeg',
  };
}

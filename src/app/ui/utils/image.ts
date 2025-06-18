class ImageUtils {
  async compressImage( file: File, quality = 0.7, maxWidth = 1920): Promise<File> {
    const imageBitmap = await createImageBitmap(file);

    const scale = Math.min(1, maxWidth / imageBitmap.width);
    const width = imageBitmap.width * scale;
    const height = imageBitmap.height * scale;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imageBitmap, 0, 0, width, height);

    const blob: Blob = await new Promise(resolve =>
      canvas.toBlob(b => resolve(b!), 'image/jpeg', quality)
    );

    return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
  }
}

export const imageUtils = new ImageUtils();

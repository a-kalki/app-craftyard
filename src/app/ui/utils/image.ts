class ImageUtils {
  async compressImage(
    file: File,
    quality = 0.7,
    maxWidth = 1920,
    aspectRatio?: number
  ): Promise<File> {
    const imageBitmap = await createImageBitmap(file);

    // Масштабирование
    const scale = Math.min(1, maxWidth / imageBitmap.width);
    let width = Math.round(imageBitmap.width * scale);
    let height = Math.round(imageBitmap.height * scale);

    // Учитываем aspectRatio, если задан
    if (aspectRatio) {
      const expectedHeight = Math.round(width / aspectRatio);

      if (expectedHeight <= height) {
        // Обрезаем вертикально
        const cropY = Math.floor((height - expectedHeight) / 2);
        height = expectedHeight;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(imageBitmap, 0, cropY / scale, width / scale, height / scale, 0, 0, width, height);

        const blob: Blob = await new Promise(resolve =>
          canvas.toBlob(b => resolve(b!), 'image/jpeg', quality)
        );

        return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
      }
      // Если изображение слишком узкое — можно сделать fallback или обрезать горизонтально аналогично
    }

    // Без обрезки
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

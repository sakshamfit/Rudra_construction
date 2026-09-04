export function fileToDataUrl(file: File): Promise<{ data: string; mime: string; name: string }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file.'));
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      reject(new Error('Image must be 12 MB or smaller.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      resolve({ data: String(reader.result || ''), mime: file.type, name: file.name });
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsDataURL(file);
  });
}

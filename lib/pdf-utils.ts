export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      // Remover el prefijo "data:application/pdf;base64,"
      const base64Data = base64String.split(",")[1];
      resolve(base64Data);
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
}

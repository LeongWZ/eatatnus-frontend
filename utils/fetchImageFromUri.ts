export default async function fetchImageFromUri(uri: string) {
  const blob = await fetch(uri).then((response) => response.blob());
  return blob;
}

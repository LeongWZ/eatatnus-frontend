export default async function s3Put(url: string, data: Blob) {
  return fetch(url, {
    method: "PUT",
    body: data,
  });
}

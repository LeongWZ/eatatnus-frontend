import { batchAnnotateImages } from "./annotateImage";
import { Image } from "@/app/types";

export default function getMenuImagesAsyncCallback() {
  const memo = new Map<string, Image[]>();

  async function getMenuImagesAsync(images: Image[]): Promise<Image[]> {
    const validImages = images.filter((image) => image.url !== undefined);

    if (validImages.length === 0) {
      return [];
    }

    const key = JSON.stringify(validImages.map((image) => image.id));

    if (memo.has(key)) {
      return memo.get(key) as Image[];
    }

    return batchAnnotateImages({
      requests: validImages.map((image) => ({
        image: {
          source: {
            imageUri: image.url as string,
          },
        },
        features: [{ type: "LABEL_DETECTION", maxResults: 20 }],
      })),
    })
      .then((response) =>
        response.data[0].responses.map((result) => result.labelAnnotations),
      )
      .then((annotations) =>
        annotations.flatMap((annotation, index) =>
          annotation.some((annotation) => annotation.description === "Menu")
            ? [validImages[index]]
            : [],
        ),
      )
      .then((menuImages) => {
        // cache the result
        memo.set(key, menuImages);
        return menuImages;
      })
      .catch((error) => {
        console.error(error.message);
        return [];
      });
  }

  return getMenuImagesAsync;
}

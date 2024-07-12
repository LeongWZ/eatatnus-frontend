import { batchAnnotateImages } from "./annotateImage";
import { Image } from "@/app/types";

function getMenuImagesAsyncCallback() {
  const memo = new Map<number, boolean>();

  async function getMenuImagesAsync(images: Image[]): Promise<Image[]> {
    const validImages = images.filter((image) => image.url !== undefined);

    const menuImages = validImages.filter(
      (image) => memo.get(image.id) ?? false,
    );

    const remainingImages = validImages.filter((image) => !memo.has(image.id));

    if (remainingImages.length === 0) {
      return menuImages;
    }

    return batchAnnotateImages({
      requests: remainingImages.map((image) => ({
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
      .then((annotations) => {
        const newMenuImages = remainingImages.filter((image, index) =>
          annotations[index].some(
            (annotation) => annotation.description === "Menu",
          ),
        );

        const nonMenuImages = remainingImages.filter((image, index) =>
          annotations[index].every(
            (annotation) => annotation.description !== "Menu",
          ),
        );

        newMenuImages.forEach((image) => memo.set(image.id, true));
        nonMenuImages.forEach((image) => memo.set(image.id, false));

        return newMenuImages.concat(menuImages);
      })
      .catch((error) => {
        console.error(error.message);
        return [];
      });
  }

  return getMenuImagesAsync;
}

const getMenuImagesAsync = getMenuImagesAsyncCallback();

export default getMenuImagesAsync;

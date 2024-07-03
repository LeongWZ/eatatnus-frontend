import { batchAnnotateImages } from "./annotateImage";
import { Image } from "@/app/types";

export default async function getMenuImages(images: Image[]): Promise<Image[]> {
  const validImages = images.filter((image) => image.url !== undefined);

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
    .catch((error) => {
      console.error(error.message);
      return [];
    });
}

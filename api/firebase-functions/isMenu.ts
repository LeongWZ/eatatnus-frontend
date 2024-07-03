import { HttpsCallableResult } from "firebase/functions";
import { annotateImage, AnnotateImageResponse } from "./annotateImage";

export default async function isMenu(uri: string): Promise<boolean> {
  const getResponse = async () => {
    try {
      return await annotateImage({
        image: {
          source: {
            imageUri: uri,
          },
        },
        features: [{ type: "LABEL_DETECTION", maxResults: 20 }],
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const response: HttpsCallableResult<AnnotateImageResponse[]> | null =
    await getResponse();

  if (!response) {
    return false;
  }

  try {
    const result: AnnotateImageResponse = response.data[0];
    const labels: string[] = result.labelAnnotations.map(
      (annotation) => annotation.description,
    );

    return labels.includes("Menu");
  } catch (error) {
    console.error(error);
    return false;
  }
}

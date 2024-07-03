import { functions } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";

type Image = {
  source: {
    imageUri: string;
  };
};

type Feature = {
  type: "LABEL_DETECTION" | "TEXT_DETECTION";
  maxResults: number;
  model?: string;
};

type ImageContext = {
  textDetectionParams: {
    enableTextDetectionConfidenceScore: boolean;
    advancedOcrOptions?: string[];
  };
};

type AnnotateImageRequest = {
  image: Image;
  features: Feature[];
  imageContext?: ImageContext;
};

type EntityAnnotation = {
  description: string;
  mid: string;
  score: number;
};

export type AnnotateImageResponse = {
  labelAnnotations: EntityAnnotation[];
};

const annotateImage = httpsCallable<
  AnnotateImageRequest,
  AnnotateImageResponse[]
>(functions, "annotateImage");

export type BatchAnnotateImagesRequest = {
  requests: AnnotateImageRequest[];
};

export type BatchAnnotateImagesResponse = {
  responses: AnnotateImageResponse[];
};

const batchAnnotateImages = httpsCallable<
  BatchAnnotateImagesRequest,
  BatchAnnotateImagesResponse[]
>(functions, "batchAnnotateImages");

export { annotateImage, batchAnnotateImages };

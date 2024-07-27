import { functions } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";

interface IContent {
  role: string;
  parts: { text: string }[];
}

type GenerateContentRequest = {
  contents: IContent[];
};

const generateContent = httpsCallable<GenerateContentRequest | string, string>(
  functions,
  "generateContent",
);

export { generateContent };

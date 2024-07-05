import { Image } from "@/app/types";
import React from "react";

const GetMenuImagesAsyncContext = React.createContext<
  (images: Image[]) => Promise<Image[]>
>((images: Image[]) => Promise.resolve([]));

export default GetMenuImagesAsyncContext;

import GetMenuImagesAsyncContext from "@/contexts/GetMenuImagesAsyncContext";
import React from "react";
import getMenuImagesAsyncCallback from "@/api/firebase-functions/getMenuImagesCallback";

type GetMenuImagesAsyncProviderProps = {
  children: React.ReactElement;
};

export default function GetMenuImagesAsyncProvider(
  props: GetMenuImagesAsyncProviderProps,
) {
  return (
    <GetMenuImagesAsyncContext.Provider value={getMenuImagesAsyncCallback()}>
      {props.children}
    </GetMenuImagesAsyncContext.Provider>
  );
}

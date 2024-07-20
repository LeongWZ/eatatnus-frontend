import * as React from "react";
import { useGlobalSearchParams, useRouter } from "expo-router";
import Gallery from "@/components/image/gallery";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function StallPhotos() {
  const router = useRouter();
  const setParams = router.setParams;
  const goBack = router.back;
  const params = useGlobalSearchParams<{ id: string; image_id: string }>();

  const stallCollection = useSelector(
    (state: RootState) => state.stallCollection,
  );

  const stall = stallCollection.items.find(
    (stall) => stall.id === parseInt(params.id ?? ""),
  );

  const images = React.useMemo(
    () => stall?.reviews.flatMap((review) => review.images) ?? [],
    [stall],
  );

  const imageId = params.image_id ? parseInt(params.image_id) : undefined;

  return (
    <Gallery
      images={images}
      imageId={imageId}
      onSetParams={setParams}
      onGoBack={goBack}
    />
  );
}

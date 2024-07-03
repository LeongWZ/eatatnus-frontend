import * as React from "react";
import { useGlobalSearchParams, useRouter } from "expo-router";
import StallCollectionContext from "@/contexts/StallCollectionContext";
import Gallery from "@/components/image/gallery";

export default function StallPhotos() {
  const router = useRouter();
  const setParams = router.setParams;
  const goBack = router.back;
  const params = useGlobalSearchParams<{ id: string; image_id: string }>();
  const { stallCollection, dispatchStallCollectionAction } = React.useContext(
    StallCollectionContext,
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

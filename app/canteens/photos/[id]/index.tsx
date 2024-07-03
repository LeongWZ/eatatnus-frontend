import * as React from "react";
import { useGlobalSearchParams, useRouter } from "expo-router";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import Gallery from "@/components/image/gallery";

export default function CanteenPhotos() {
  const router = useRouter();
  const setParams = router.setParams;
  const goBack = router.back;
  const params = useGlobalSearchParams<{ id: string; image_id: string }>();
  const { canteenCollection, dispatchCanteenCollectionAction } =
    React.useContext(CanteenCollectionContext);

  const canteen = canteenCollection.items.find(
    (canteen) => canteen.id === parseInt(params.id ?? ""),
  );

  const images = React.useMemo(
    () => canteen?.reviews.flatMap((review) => review.images) ?? [],
    [canteen],
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

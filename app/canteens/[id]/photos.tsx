import * as React from "react";
import { useGlobalSearchParams, useNavigation, useRouter } from "expo-router";
import Gallery from "@/components/image/gallery";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function CanteenPhotos() {
  const router = useRouter();
  const setParams = router.setParams;
  const goBack = router.back;
  const params = useGlobalSearchParams<{ id: string; image_id: string }>();

  const canteenCollection = useSelector(
    (state: RootState) => state.canteenCollection,
  );

  const canteen = canteenCollection.items.find(
    (canteen) => canteen.id === parseInt(params.id ?? ""),
  );

  const images = React.useMemo(
    () => canteen?.reviews.flatMap((review) => review.images) ?? [],
    [canteen],
  );

  const imageId = params.image_id ? parseInt(params.image_id) : undefined;

  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      title: canteen?.name ? `${canteen.name} Photos` : "Photos",
    });
  }, [navigation]);

  return (
    <Gallery
      images={images}
      imageId={imageId}
      onSetParams={setParams}
      onGoBack={goBack}
    />
  );
}

import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AwesomeGallery, {
  GalleryRef,
  RenderItemInfo,
} from "react-native-awesome-gallery";
import * as React from "react";
import { Image } from "expo-image";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image as ImageType } from "@/app/types";

const renderItem = ({
  item,
  setImageDimensions,
}: RenderItemInfo<{ uri: string }>) => {
  return (
    <Image
      source={item.uri}
      style={StyleSheet.absoluteFillObject}
      contentFit="contain"
      onLoad={(e) => {
        const { width, height } = e.source;
        setImageDimensions({ width, height });
      }}
    />
  );
};

type GalleryProps = {
  images: ImageType[];
  imageId?: number;
  onSetParams: (params: { image_id?: string }) => void;
  onGoBack: () => void;
};

export default function Gallery(props: GalleryProps) {
  const { images, imageId, onSetParams, onGoBack } = props;

  const { top, bottom } = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const index = Math.max(
    0,
    images.findIndex((image) => image.id === imageId),
  );

  const gallery = useRef<GalleryRef>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [infoVisible, setInfoVisible] = useState(true);

  useEffect(() => {
    StatusBar.setBarStyle(isFocused ? "light-content" : "dark-content", true);
    if (!isFocused) {
      StatusBar.setHidden(false, "fade");
    }
  }, [isFocused]);

  const onIndexChange = useCallback(
    (index: number) => {
      if (isFocused) {
        onSetParams({ image_id: images.at(index)?.id.toString() });
      }
    },
    [images, isFocused, onSetParams],
  );

  const onTap = () => {
    StatusBar.setHidden(infoVisible, "slide");
    setInfoVisible(!infoVisible);
  };

  return (
    <View style={styles.container}>
      {infoVisible && (
        <Animated.View
          entering={mounted ? FadeInUp.duration(250) : undefined}
          exiting={FadeOutUp.duration(250)}
          style={[
            styles.toolbar,
            {
              height: top + 60,
              paddingTop: top,
            },
          ]}
        >
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>
              {index + 1} of {images.length}
            </Text>
          </View>
        </Animated.View>
      )}
      <AwesomeGallery
        ref={gallery}
        data={images.map((image) => ({ ...image, uri: image.url ?? "" }))}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        initialIndex={index}
        numToRender={3}
        doubleTapInterval={150}
        onIndexChange={onIndexChange}
        onSwipeToClose={onGoBack}
        onTap={onTap}
        loop
        onScaleEnd={(scale) => {
          if (scale < 0.8) {
            onGoBack();
          }
        }}
      />
      {infoVisible && (
        <Animated.View
          entering={mounted ? FadeInDown.duration(250) : undefined}
          exiting={FadeOutDown.duration(250)}
          style={[
            styles.toolbar,
            styles.bottomToolBar,
            {
              height: bottom + 100,
              paddingBottom: bottom,
            },
          ]}
        >
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() =>
                gallery.current?.setIndex(
                  index === 0 ? Math.max(0, images.length - 1) : index - 1,
                )
              }
            >
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() =>
                gallery.current?.setIndex(
                  index === images.length - 1 ? 0 : index + 1,
                  true,
                )
              }
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toolbar: {
    position: "absolute",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  bottomToolBar: {
    bottom: 0,
  },
  headerText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});

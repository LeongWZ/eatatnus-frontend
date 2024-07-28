import { Review } from "@/app/types";
import getAverageRating from "@/utils/getAverageRating";
import { Rating } from "@kolking/react-native-rating";
import { View, Text, ActivityIndicator } from "react-native";
import Markdown from "react-native-markdown-display";
import { BarChart } from "react-native-gifted-charts";

type ReviewSummaryProps = {
  reviews: Review[];
  body?: string;
  isBodyLoading?: boolean;
};

export default function ReviewSummary(props: ReviewSummaryProps) {
  const { reviews, body, isBodyLoading } = props;

  // O(n^2 solution but no side-effects)
  const reviewCount: number[] = [1, 2, 3, 4, 5].map(
    (rating) => reviews.filter((review) => review.rating === rating).length,
  );

  const averageRating = getAverageRating(reviews);

  return (
    <View>
      <View className="flex-row space-x-2 mt-1">
        <Text className="text-xl">{averageRating}</Text>
        <Rating maxRating={5} rating={averageRating} size={24} disabled />
        <Text className="text-lg">
          {reviewCount.reduce((a, b) => a + b, 0)} reviews
        </Text>
      </View>
      <View className="border rounded mt-2">
        <BarChart
          horizontal
          data={reviewCount.map((count, index) => ({
            labelComponent: () => (
              <View className="flex-row space-x-1">
                <Text className="text-sm">{`${index + 1}`}</Text>
                <Rating maxRating={1} rating={1} size={18} disabled />
              </View>
            ),
            value: count,
            topLabelComponent: () => <Text className="text-base">{count}</Text>,
          }))}
          maxValue={Math.max(...reviewCount) + 5}
          spacing={10}
          hideAxesAndRules
          shiftY={-30}
          shiftX={-10}
          disablePress
        />
      </View>
      {(body || isBodyLoading) && (
        <View className="mt-2">
          <Text className="text-xl mb-1">What did reviewers say?</Text>
          {body && <Markdown>{body}</Markdown>}
          {isBodyLoading && (
            <View className="m-2 items-center">
              <ActivityIndicator />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

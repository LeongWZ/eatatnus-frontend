import { Food } from "@/app/types";

export default interface DraftItem {
  food: Omit<Food, "id">;
  count?: number;
}

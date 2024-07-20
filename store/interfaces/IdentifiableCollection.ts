import Identifiable from "./Identifiable";

export default interface IdentifiableCollection<T extends Identifiable> {
  items: T[];
  loading: boolean;
  errorMessage: string | null;
}

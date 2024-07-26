import { AutocompleteDropdownContextProvider as ImportedAutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

type AutocompleteDropdownContextProviderProps = {
  children: React.ReactElement;
};

export default function AutocompleteDropdownContextProvider(
  props: AutocompleteDropdownContextProviderProps,
) {
  return (
    <ImportedAutocompleteDropdownContextProvider>
      {props.children}
    </ImportedAutocompleteDropdownContextProvider>
  );
}

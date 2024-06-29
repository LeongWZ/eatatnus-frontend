// @ts-expect-error: No declaration file for module
// eslint-disable-next-line import/no-unresolved
import { HoldMenuProvider as ImportedHoldMenuProvider } from "react-native-hold-menu";

type HoldMenuProviderProps = {
  children: React.ReactElement;
};

export default function HoldMenuProvider(props: HoldMenuProviderProps) {
  return (
    <ImportedHoldMenuProvider
      theme="light"
      safeAreaInsets={{
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
    >
      {props.children}
    </ImportedHoldMenuProvider>
  );
}

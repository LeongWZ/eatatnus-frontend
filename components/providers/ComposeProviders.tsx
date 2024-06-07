import { ReactElement } from "react";

type ComposeProvidersProps = {
    providers: React.FunctionComponent<{ children: ReactElement }>[];
    children: React.ReactElement;
}

export default function ComposeProviders(props: ComposeProvidersProps) {
    const { providers, children } = props;

    return providers.reduceRight((acc, Provider) => (
        <Provider>
            {acc}
        </Provider>
    ), children);
}
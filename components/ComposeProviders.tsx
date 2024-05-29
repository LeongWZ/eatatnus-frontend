import { ReactNode } from "react";

type ComposeProvidersProps = {
    providers: React.FunctionComponent<{ children: ReactNode }>[];
    children: React.ReactNode;
}

export default function ComposeProviders(props: ComposeProvidersProps) {
    const { providers, children } = props;

    return providers.reduceRight((acc, Provider) => (
        <Provider>
            {acc}
        </Provider>
    ), children);
}
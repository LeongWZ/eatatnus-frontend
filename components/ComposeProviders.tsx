import { ReactNode } from "react";

type ProvidersProps = {
    providers: React.FunctionComponent<{ children: ReactNode }>[];
    children: React.ReactNode;
}

export default function Providers(props: ProvidersProps) {
    const { providers, children } = props;

    return providers.reduceRight((acc, Provider) => (
        <Provider>
            {acc}
        </Provider>
    ), children);
}
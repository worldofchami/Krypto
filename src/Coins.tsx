import { SectionHeading } from "./components/ui/Display";
import { CurrencyBlockContainer } from "./Index";

export const Coins: React.FunctionComponent<{}> = () => {

    return (
        <>
            <SectionHeading text="Cryptocurrencies" primary={false} />
            <CurrencyBlockContainer
                limit={100}
            />
        </>
    )
};
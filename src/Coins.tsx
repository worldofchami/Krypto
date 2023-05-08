import { SectionHeading } from "./components/ui/Display";
import { CurrencyBlockContainer, MarketSummaryContainer } from "./Index";

export const Coins: React.FunctionComponent<{}> = () => {

    return (
        <>
            <SectionHeading text="Market Summary" primary={false} />
            <MarketSummaryContainer limit={10} />
            <SectionHeading text="Cryptocurrencies" primary={false} />
            <CurrencyBlockContainer
                limit={100}
            />
        </>
    )
};
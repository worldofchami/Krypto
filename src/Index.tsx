import { createContext, useEffect, useState, useContext } from "react";

const BINANCE_BASE_URL = "https://api.binance.com";
const CG_BASE_URL = "https://api.coingecko.com/api/v3";

import JSONData from './assets/json/data.json';

interface Coin {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_24h: number;
};

const MarketSummaryBlock: React.FunctionComponent<Coin> = ({ id, name, symbol, image, current_price, price_change_24h }) => {
    return (
        <>
            <span>{id}</span>
            <br />
            <span>{name}</span>
            <br />
            <span>{symbol}</span>
            <br />
            <span>{image}</span>
            <br />
            <span>{current_price}</span>
            <br />
            <span>{price_change_24h}</span>
            <br />
            <br />
        </>
    );
};

interface MSCProps {
    data: Coin[];
};

const MarketSummaryContainer: React.FunctionComponent<{}> = () => {
    const data = useContext(DataContext)?.['data'];

    const roundDecimal = (price: number): number => {
        return price<1 ? Number(price.toFixed(4)) : Number(price.toFixed(2))
    };

    const marketSummaryBlocks: (JSX.Element[] | undefined) = data?.splice(0,7)?.map(({ id, name, symbol, image, current_price, price_change_24h }, key) => {
        return (
            <MarketSummaryBlock
                id={id}
                name={name}
                symbol={symbol}
                image={image}
                current_price={roundDecimal(current_price)}
                price_change_24h={roundDecimal(price_change_24h/current_price)}
                key={key}
            />
        )
    });

    return (
        <>
            <span>{marketSummaryBlocks}</span>
        </>
    );
};

export const DataContext = createContext<MSCProps | null>(null);

export const Index: React.FunctionComponent<{}> = () => {
    const [data, setData] = useState<Coin[]>([]);

    const contextStates = {
        data,
    };

    // /*

    useEffect(() => {
        //Get BTC price
        const getBinance = async (): Promise<void> => {
            const response = await fetch(`${BINANCE_BASE_URL}/api/v3/avgPrice?symbol=ETHBTC`);

            const data = await response.json();

            setData(data);
        };

        const getCoinGecko = async (): Promise<void> => {
            // const response = await fetch(`${CG_BASE_URL}/coins/markets?vs_currency=usd`);
            
            const data = JSONData //await response.json();

            setData(data.map(({ id, name, symbol, image, current_price, price_change_24h }: Coin) => {
                return { id, name, symbol, image, current_price, price_change_24h }
            }));
        };

        getCoinGecko();
        
    }, []);

    // */

    return (
        <DataContext.Provider value={contextStates}>
            <MarketSummaryContainer />
        </DataContext.Provider>
    );
};
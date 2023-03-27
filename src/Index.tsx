import { useEffect, useState } from "react";

const BINANCE_BASE_URL = "https://api.binance.com";
const CG_BASE_URL = "https://api.coingecko.com/api/v3";

interface Coin {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_24h: number;
};

interface MSProps {
    data: Coin[];
};

const MarketSummary: React.FunctionComponent<MSProps> = ({ data }) => {
    

    return (
        <>
            <span>{JSON.stringify(data)}</span>
        </>
    );
};

const Index: React.FunctionComponent<{}> = () => {
    const [data, setData] = useState<Coin[]>([]);

    // /*

    useEffect(() => {
        //Get BTC price
        const getBinance = async (): Promise<void> => {
            const response = await fetch(`${BINANCE_BASE_URL}/api/v3/avgPrice?symbol=BTCUSD`);
            const data = await response.json();

            setData(data);
        };

        const getCoinGecko = async (): Promise<void> => {
            const response = await fetch(`${CG_BASE_URL}/coins/markets?vs_currency=usd`);
            const data = await response.json();

            setData(data.map(({ id, name, symbol, image, current_price, price_change_24h }: Coin) => {
                return { id, name, symbol, image, current_price, price_change_24h }
            }));
        };

        // getCoinGecko();
        
    }, []);

    // */

    return (
        <>
            {/* <span>{JSON.stringify(data)}</span> */}
            <MarketSummary data={data.splice(0,7)} />
        </>
    );
};

export default Index;

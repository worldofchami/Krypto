import React, { createContext, useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { Index } from "./Index";
import JSONData from './assets/json/data.json';
import { Coin } from "./Coin";

const BINANCE_BASE_URL = "https://api.binance.com";
const CG_BASE_URL = "https://api.coingecko.com/api/v3";

interface MSCProps {
    data: Coin[];
};

export const AppContext = createContext<MSCProps | null>(null);

export interface Coin {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_24h: number;
    high_24h?: number;
    low_24h?: number;
    idx?: number;
};

export const App = (): (React.ReactElement | null) => {
    const routes: (React.ReactElement | null) = useRoutes([
        {
            path: '/',
            element: <Index />,
        },
        {
            path: '/coin/:id',
            element: <Coin />,
        },
    ]);

    const [data, setData] = useState<Coin[]>([]);

    const contextStates = {
        data,
    };

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

            setData(data.map(({ id, name, symbol, image, current_price, price_change_24h, high_24h, low_24h }: Coin) => {
                return { id, name, symbol, image, current_price, price_change_24h, high_24h, low_24h }
            }));
        };

        getCoinGecko();
        
    }, []);


    return (
        <AppContext.Provider value={contextStates}>
            {routes}
        </AppContext.Provider>
    );
};
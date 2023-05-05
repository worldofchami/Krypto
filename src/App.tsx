import React, { createContext, useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { Index } from "./Index";
import JSONData from "./assets/json/data.json";
import NewsData from "./assets/json/news.json";
import { CoinPage } from "./CoinPage";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { TestChart } from "./TestChart";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";

export const BINANCE_BASE_URL = "https://api.binance.com";
export const CG_BASE_URL = "https://api.coingecko.com/api/v3";
export const CRYPTO_PANIC_BASE_URL = "https://cryptopanic.com/api/v1";
export const CRYPTO_PANIC_AUTH_TOKEN = "";
export const COIN_CAP_BASE_URL = "https://api.coincap.io/v2";

const processDescription = (description: string): string => {
    if (description !== undefined) {
        while (description.indexOf("<") >= 0) {
            const start = description.substring(0, description.indexOf("<"));
            const toDelete = description.substring(
                start.length,
                description.indexOf(">") + 1
            );

            description = description.replaceAll(toDelete, "");
        }

        return description.replaceAll("\\r", "").replaceAll("\\n", "\n");
    } else return "";
};

export interface MSCProps {
    data: Coin[];
}

export interface NBProps {
    newsData: NewsArticle[];
}

export interface RTUpdate {
    currency: string;
    price: number;
}

export interface MSChartProps {
    current_price: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
}

export interface CoinInfo {
    name: string;
    description: string;
    upvotes: number;
    categories: string[];
    genesisDate: Date;
    image: string;
    symbol: string;
    page: string;
    rank: number;
}

export interface CoinPrices {
    price: string;
    time: Date;
    date: Date;
}

export interface Test {
    priceUsd: string;
    time: string;
    date: string;
}

export const AppContext = createContext<MSCProps | NBProps | RTUpdate | null>(null);

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
}

export interface ICoinProps {
    priceData: CoinPrices[];
    name: string | undefined;
}

export interface NewsArticle {
    kind: "news" | "media";
    source: {
        title: string;
    };
    title: string;
    url: string;
    currencies?: [
        {
            code: string;
            title: string;
        }
    ];
    created_at: string;
}

export const App = (): React.ReactElement | null => {
    const routes: React.ReactElement | null = useRoutes([
        {
            path: "/",
            element: <Index />,
        },
        {
            path: "/coin/:id",
            element: <CoinPage />,
        },
        {
            path: "/chart",
            element: <TestChart />
        }
    ]);

    const socketUrl = `wss://ws.coincap.io/prices?assets=bitcoin,ethereum`;

    const [lastRTUpdate, setLastRTUpdate] = useState<RTUpdate | null>(null);

    

    const [data, setData] = useState<Coin[]>([]);
    const [newsData, setNewsData] = useState<NewsArticle[]>([]);

    const contextStates = {
        data,
        newsData,
        lastRTUpdate,
    };

    useEffect(() => {
        const ws = new WebSocket(socketUrl);

        ws.onopen = (event) => {
            console.log(event)
        };
    
        ws.onmessage = (event) => {
            console.log(event)
            const data = JSON.parse(event.data);
            const currency = Object.keys(data)[0];
            const price = Number(Object.values(data)[0]);
        
            setLastRTUpdate({ currency, price });
        };

        //Get BTC price
        const getBinance = async (): Promise<void> => {
            const response = await fetch(
                `${BINANCE_BASE_URL}/api/v3/avgPrice?symbol=ETHBTC`
            );

            const data = await response.json();

            setData(data);
        };

        const getCoinGecko = async (): Promise<void> => {
            const response = await fetch('http://localhost:3000/coingecko');

            const data = await response.json();

            setData(
                data.map(
                    ({
                        id,
                        name,
                        symbol,
                        image,
                        current_price,
                        price_change_24h,
                        high_24h,
                        low_24h,
                    }: Coin) => {
                        return {
                            id,
                            name,
                            symbol,
                            image,
                            current_price,
                            price_change_24h,
                            high_24h,
                            low_24h,
                        };
                    }
                )
            );
        };

        const getCryptoPanic = async (): Promise<void> => {
            const response = await fetch('http://localhost:3000/news');
            const data = await response.json();

            setNewsData(
                (data as NewsArticle[])
                    .filter((article: NewsArticle) => article.kind === "news")
                    .filter(
                        (article: NewsArticle) =>
                            article?.currencies !== undefined
                    )
            );
        };

        getCoinGecko();
        getCryptoPanic();
    }, []);

    return (
        <AppContext.Provider value={contextStates}>
            <NavBar />
            {routes}
            <Footer />
        </AppContext.Provider>
    );
};

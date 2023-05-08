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
import { Coins } from "./Coins";
import { Coin, MSCProps, NBProps, NewsArticle, RTData, RTUpdate } from "./client/interfaces";
import { ScrollResetter } from "./ScrollResetter";

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

export const AppContext = createContext<MSCProps | NBProps | RTData | null>(null);

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
            path: "/coins",
            element: <Coins />,
        },
    ]);

    const [update, setUpdate] = useState<RTUpdate>({ currency: '', price: 0 });

    const [data, setData] = useState<Coin[]>([]);
    const [newsData, setNewsData] = useState<NewsArticle[]>([]);

    const contextStates = {
        data,
        newsData,
        update,
    };

    const [socketUrl, setSocketUrl] = useState<string>(`wss://ws.coincap.io/prices?assets=bitcoin,ethereum`);

    useEffect(() => {
        const ws = new WebSocket(socketUrl);

        ws.onopen = (event) => {
            console.log(event)
        };
    
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const currency = Object.keys(data)[0];
            const price = Number(Object.values(data)[0]);
        
            setUpdate({ currency, price });
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

            const coinNames: string[] = data.map(({ name }: Coin, idx: number) => {
                if(idx < 10) return name;
            });
        
            // Removes null values
            coinNames.filter((name) => name);

            setSocketUrl(`wss://ws.coincap.io/prices?assets=${coinNames.join(',')}`);

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
            <ScrollResetter />
            <NavBar />
            {routes}
            <Footer />
        </AppContext.Provider>
    );
};

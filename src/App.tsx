import React, { createContext, useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { Index } from "./Index";
import { CoinPage } from "./CoinPage";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { Coins } from "./Coins";
import { Coin, CtxTheme, MSCProps, NBProps, NewsArticle, RTData, RTUpdate, theme } from "./client/interfaces";
import { ScrollResetter } from "./ScrollResetter";
import { aliases } from "./components/ui/Display";
import { useFetchLocalStorage, useUpdateTheme } from "./hooks/hooks";

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

            description = description.replace(new RegExp(toDelete, "g"), "");
        }

        return description.replace(new RegExp("\\r", "g"), "").replace(new RegExp("\\n", "g"), "\n");
    } else return "";
};

export const AppContext = createContext<MSCProps | NBProps | RTData | CtxTheme | null>(null);
export const RealTimeContext = createContext<RTData | null>(null);

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

    const userTheme = useFetchLocalStorage("theme") as theme;

    const [theme, setTheme] = useState<theme>(userTheme);

    const contextStates = {
        data,
        newsData,
        theme,
    };

    const u: RTUpdate = {currency: 'btc', price: 2};

    const rtContextStates = {
        update,
    };

    useEffect(() => {
        setTheme(userTheme);
        useUpdateTheme(userTheme);

        return () => {};
    }, [userTheme])

    useEffect(() => {
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

            const coinNames: string[] = data?.map(({ name }: Coin, idx: number) => {
                if(idx < 100) return name;
            });

            // Removes null values
            coinNames.filter((name) => name);

            const coinAliases: (string | undefined)[] = coinNames?.map((name) => {
                if(name) return aliases[name.replace(new RegExp(" ", "g"), '-').toLowerCase()]
            });

            const socketUrl = `wss://ws.coincap.io/prices?assets=${coinAliases.splice(0, 100).join(',')}`;
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
        
            setData(data.map(({ id, name, symbol, image, current_price, price_change_24h, high_24h, low_24h, }: Coin) => {
                    return { id, name, symbol, image, current_price, price_change_24h, high_24h, low_24h, };
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
            <RealTimeContext.Provider value={rtContextStates}>
                {routes}
            </RealTimeContext.Provider>
            <Footer />
        </AppContext.Provider>
    );
};

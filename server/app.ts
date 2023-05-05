import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 3000;
import cors from "cors";
app.use(cors());

app.listen(port, () => {
    console.log("listening", port);
});

export const BINANCE_BASE_URL = "https://api.binance.com";
export const CG_BASE_URL = "https://api.coingecko.com/api/v3";
export const CRYPTO_PANIC_BASE_URL = "https://cryptopanic.com/api/v1";
export const CRYPTO_PANIC_AUTH_TOKEN = process.env.CRYPTO_PANIC_AUTH_TOKEN;
export const COIN_CAP_BASE_URL = "https://api.coincap.io/v2";

const processDescription = (description: string): string => {
    if (description !== undefined) {
        while (description.indexOf("<") >= 0) {
            const start = description.substring(0, description.indexOf("<"));
            const toDelete = description.substring(
                start.length,
                description.indexOf(">") + 1
            );

            description = description.split(toDelete).join("");
        }

        return description.split("\\r").join("").split("\\n").join("\n");
    } else return "";
};

export interface MSCProps {
    data: Coin[];
}

export interface NBProps {
    newsData: NewsArticle[];
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

const getBinance = async (): Promise<void> => {
    const response = await fetch(
        `${BINANCE_BASE_URL}/api/v3/avgPrice?symbol=ETHBTC`
    );

    const data = await response.json();

    (data);
};

let CGData: Coin[] = [];

const getCoinGecko = async (): Promise<void> => {
    const response = await fetch(`${CG_BASE_URL}/coins/markets?vs_currency=usd`);
    const data = await response.json();

    CGData = (
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

app.get('/coingecko', (req, res) => {
    res.json(CGData);
});

let CoinData: CoinInfo;

const fetchCoinData = async (id: string): Promise<void> => {
    const response = await fetch(`${CG_BASE_URL}/coins/${id}`);
    const data = await response.json();
    CoinData = ({
        name: data.name,
        description: processDescription(data.description?.en),
        upvotes: data.sentiment_votes_up_percentage,
        categories: data.categories,
        genesisDate: new Date(data.genesis_date),
        image: data.image?.large,
        symbol: data.symbol,
        page: data.links?.homepage[0],
        rank: data.market_cap_rank,
    } as CoinInfo);
};

app.get('/info', (req, res) => {
    res.json(CoinData);
});

export interface Test {
    priceUsd: string;
    time: string;
    date: string;
}

let PriceData: CoinPrices[] = [];
let id: string = "";

const fetchPriceData = async (id: string): Promise<void> => {
    const response = await fetch(
        `${COIN_CAP_BASE_URL}/assets/${id}/history?interval=d1`
    );
    const data = await response.json();

    // PriceData = (
    //     data.data.map(({ priceUsd, time, date }: Test) => {
    //         return {
    //             price: priceUsd,
    //             time: new Date(time),
    //             date: new Date(date),
    //         } as CoinPrices;
    //     })
    // );

    PriceData = data;
};

app.get('/price/:id', async (req, res) => {
    await fetchPriceData(req.params.id);
    res.send(JSON.stringify(PriceData));
});

let NewsData: NewsArticle[];
const getCryptoPanic = async (): Promise<void> => {
    const response = await fetch(`${CRYPTO_PANIC_BASE_URL}/posts/?auth_token=${CRYPTO_PANIC_AUTH_TOKEN}`);
    const data = await response.json();

    NewsData =
        data.results.map(({ kind, source, title, url, currencies, created_at }: NewsArticle) => {
            const { title: sourceTitle } = source;
            return {
                kind,
                source: {
                    title: sourceTitle
                },
                title,
                url,
                currencies,
                created_at
             } as NewsArticle;
        });
};

app.get('/news', async (req, res) => {
    try {
        await getCryptoPanic();
        res.send(NewsData);
    }

    catch(e) {
        console.log(e);
    }
});

app.get('/coin/:id', async (req, res) => {
    await getData1D(req.params.id);
    res.json(CoinData);
})

let SpecificNews: NewsArticle[];

const getSpecificNews = async (symbol: string): Promise<void> => {
    const response = await fetch(
        `${CRYPTO_PANIC_BASE_URL}/posts/?auth_token=${CRYPTO_PANIC_AUTH_TOKEN}&currencies=${symbol}`
    );
    const data = await response.json();

    SpecificNews = data?.results?.map(({ title, kind, source, url, created_at }: NewsArticle) => {
        return {
            title,
            kind,
            source,
            url,
            created_at
        } as NewsArticle;
    });
};

app.get('/news/:id', async (req, res) => {
    await getSpecificNews(req.params.id);
    res.json(SpecificNews);
})

const getData5S = async(): Promise<void> => {
    await getCoinGecko();
    console.log("CoinGecko refresh")
};

const getPrices = async (): Promise<void> => {
    await fetchPriceData(id);
    console.log("Price refresh")
};

const getData1D = async (id: string): Promise<void> => {
    await fetchCoinData(id);
    console.log("Coin Data refresh");
};

const getData = async () => {
    getData5S();
    getPrices();
};

getData();
setInterval(getData5S, 50000);
// setInterval(getPrices, 50000);
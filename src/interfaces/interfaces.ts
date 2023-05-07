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
    colour?: "red" | "green";
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

export interface RTData {
    update: RTUpdate;
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

export interface CBCProps {
    limit: number;
}
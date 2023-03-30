import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CG_BASE_URL, CoinInfo, CoinPrices, COIN_CAP_BASE_URL, CRYPTO_PANIC_AUTH_TOKEN, CRYPTO_PANIC_BASE_URL, NewsArticle } from "./App";
import PriceData from './assets/json/prices.json';
import BitcoinData from './assets/json/bitcoin.json';
import BTCNews from './assets/json/btcnews.json';
import { ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import { formatDate } from './Index';

const processDescription = (description: string): string => {
    if(description !== undefined) {
        while(description.indexOf('<') >= 0) {
            const start = description.substring(0, description.indexOf('<'))
            const toDelete = description.substring(start.length, description.indexOf('>')+1)
            
            description = description.replaceAll(toDelete, '');
        }

        return description
            .replaceAll('\\r', '')
            .replaceAll('\\n', '\n')
    }

    else return '';
};

export const Coin: React.FunctionComponent<{}> = () => {
    const { id } = useParams();
    const [priceData, setPriceData] = useState<CoinPrices[]>([]);
    const [coinInfo, setCoinInfo] = useState<CoinInfo>();
    const [coinNews, setCoinNews] = useState<NewsArticle[]>([]);
    
    useEffect(() => {
        const fetchCoinData = async (): Promise<void>  => {
            // const response = await fetch(`${CG_BASE_URL}/coins/${id}`);
            const data = BitcoinData // await response.json();
            setCoinInfo({
                description: processDescription(data.description.en),
                upvotes: data.sentiment_votes_up_percentage,
                categories: data.categories,
                genesisDate: new Date(data.genesis_date),
                image: data.image.large,
                symbol: data.symbol,
                page: data.links.homepage[0],
                rank: data.market_cap_rank
            } as CoinInfo);
        };

        const fetchPriceData = async (): Promise<void> => {
            // const response = await fetch(`${COIN_CAP_BASE_URL}/assets/${id}/history?interval=d1`);
            const data = PriceData; // await response.json();

            setPriceData(data.data.map(({ priceUsd, time, date }) => {
                return { price: priceUsd, time: new Date(time), date: new Date(date) } as CoinPrices
            }));
        };

        const fetchNewsData = async (): Promise<void> => {
            // const response = await fetch(`${CRYPTO_PANIC_BASE_URL}/posts/?auth_token=${CRYPTO_PANIC_AUTH_TOKEN}&currencies=BTC`);
            const data = BTCNews // await response.json();

            setCoinNews(data.results.map(({ title, kind, source, url, created_at }) => {
                return { title, kind, source, url, created_at } as NewsArticle;
            }))
        };

        fetchCoinData();
        fetchPriceData();

    }, []);

    const data = priceData.map(price_collection => Number(price_collection.price));

    const chartOptions = {
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                
            },
            x: {
                
            },
        },
    };

    const labels: string[] = [];
    for(const idx in data) {
        if(Number(idx) % 2 === 0) {
            labels.push(formatDate(priceData[idx].date))
        }

        else labels.push('');
    }

    const chartData: ChartData<"line"> = {
        labels,
        datasets: [
            {
                data,
                borderColor: data[0] > data[-1] ? "#00ff90" : "#fe1b30",
                stepped: false,
            },
        ],
    };

    return (
        <>
            {/* {JSON.stringify(coinInfo)} */}
            <Line data={chartData} options={chartOptions} />
        </>
    );
};
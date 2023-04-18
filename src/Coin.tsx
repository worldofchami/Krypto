import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    CG_BASE_URL,
    CoinInfo,
    CoinPrices,
    COIN_CAP_BASE_URL,
    CRYPTO_PANIC_AUTH_TOKEN,
    CRYPTO_PANIC_BASE_URL,
    ICoinProps,
    NewsArticle,
    Test,
} from "./App";
import PriceData from "./assets/json/prices.json";
import BitcoinData from "./assets/json/bitcoin.json";
import BTCNews from "./assets/json/btcnews.json";
import { ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import { formatDate, NewsBlock, roundedDecimalAsString } from "./Index";
import {
    DropDown,
    DropDownContainer,
    SectionHeading,
} from "./components/ui/Display";

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

const capitaliseStr = (str: string): string => {
    if(str) {
        const arr: string[] = [];

        for(const word of str.split(' ')) {
            arr.push(word.charAt(0).toUpperCase() + word.substring(1, word.length))
        }

        return arr.join(' ');
    }

    return '';
};

const CoinGraph: React.FunctionComponent<ICoinProps> = ({ priceData }) => {
    const data = priceData.map((price_collection) =>
        Number(price_collection.price)
    );

    const chartOptions = {
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {},
            x: {},
        },
        elements: {
            point: {
                radius: 0,
            },
        },
    };

    const labels: string[] = [];
    for (const idx in data) {
        if (Number(idx) % 20 === 0) {
            labels.push(formatDate(priceData[idx].date));
        } else labels.push("");
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

    return <Line data={chartData} options={chartOptions} />;
};

export const Coin: React.FunctionComponent<{}> = () => {
    const { id } = useParams();

    const [priceData, setPriceData] = useState<CoinPrices[]>([]);

    const [coinInfo, setCoinInfo] = useState<CoinInfo>();

    const [coinNews, setCoinNews] = useState<NewsArticle[]>([]);
    const [newsBlocks, setNewsBlocks] = useState<JSX.Element[]>();

    const [chartPeriod, setChartPeriod] = useState<string>("d1");

    const fetchPriceData = async (): Promise<void> => {
        const response = await fetch(`http://localhost:3000/price/${id}`);
        const data = await response.json();

        setPriceData(
            data.data.map(({ priceUsd, time, date }: Test) => {
                return {
                    price: priceUsd,
                    time: new Date(time),
                    date: new Date(date),
                } as CoinPrices;
            })
        );
    };

    useEffect(() => {
        const fetchCoinData = async (): Promise<void> => {
            const response = await fetch(`${CG_BASE_URL}/coins/${id}`);
            const data = await response.json();
            setCoinInfo({
                description: processDescription(data.description.en),
                upvotes: data.sentiment_votes_up_percentage,
                categories: data.categories,
                genesisDate: new Date(data.genesis_date),
                image: data.image.large,
                symbol: data.symbol,
                page: data.links.homepage[0],
                rank: data.market_cap_rank,
            } as CoinInfo);
        };

        const fetchNewsData = async (): Promise<void> => {
            const response = await fetch(
                `${CRYPTO_PANIC_BASE_URL}/posts/?auth_token=${CRYPTO_PANIC_AUTH_TOKEN}&currencies=${id?.toUpperCase()}`
            );
            const data = await response.json();

            // setCoinNews(
                
            // );

            const coinNews = data?.results?.map(({ title, kind, source, url, created_at }: NewsArticle) => {
                return {
                    title,
                    kind,
                    source,
                    url,
                    created_at
                } as NewsArticle;
            });
            
            setNewsBlocks(coinNews?.map(({ title, kind, source, url, created_at }: NewsArticle) => {
                return (
                    <NewsBlock
                        kind={kind}
                        title={title}
                        source={source}
                        url={url}
                        created_at={created_at}
                    />
                );
            }))

        };

        fetchPriceData();
        fetchCoinData();
        fetchNewsData();

    }, []);

    const callbackPriceData = useCallback<(period: string) => void>(
        (period: string) => {
            setChartPeriod(period);
            fetchPriceData();
        },
        [chartPeriod]
    );

    return (
        <>
            <div className="mb-6">
                <DropDownContainer
                    modifier={callbackPriceData}
                    text={chartPeriod}
                >
                    <DropDown
                        text="1Y"
                        value="d1"
                        selected={chartPeriod === "d1"}
                    />
                    <DropDown
                        text="7D"
                        value="m1"
                        selected={chartPeriod === "m1"}
                    />
                    <DropDown
                        text="12H"
                        value="h12"
                        selected={chartPeriod === "h12"}
                    />
                </DropDownContainer>
            </div>
            <div className="w-full h-[60vh] flex gap-x-4">
                <div className="w-3/4 h-fit p-8 bg-[rgb(22,22,22)] rounded-2xl">
                    <CoinGraph priceData={priceData} />
                </div>
                <div className="w-1/4 h-full bg-[rgb(22,22,22)] rounded-2xl overflow-auto flex flex-col gap-y-4 p-2">
                    {newsBlocks}
                </div>
            </div>
            <div className="w-full h-screen flex flex-col pt-6">
                <div className="flex items-center gap-x-2 h-12">
                    <h1 className="text-5xl font-heading">#{coinInfo?.rank}</h1>
                    <img src={coinInfo?.image} alt="" className="h-4/5 object-contain self-start" />
                    <h1 className="text-5xl font-heading">{coinInfo?.symbol?.toUpperCase()}</h1>
                    <h1 className="text-md font-heading">{coinInfo?.symbol?.toUpperCase()}</h1>
                </div>
                <div>
                    <h1 className="text-3xl">${roundedDecimalAsString(Number(priceData?.[priceData?.length-1]?.price))}</h1>
                </div>
            </div>
        </>
    );
};

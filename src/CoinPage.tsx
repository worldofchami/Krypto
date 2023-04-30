import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { aliases, symbols } from "./components/ui/Display";
import {
    AppContext,
    CG_BASE_URL,
    Coin,
    CoinInfo,
    CoinPrices,
    COIN_CAP_BASE_URL,
    CRYPTO_PANIC_AUTH_TOKEN,
    CRYPTO_PANIC_BASE_URL,
    ICoinProps,
    MSCProps,
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

const processDate = (date: Date): string => {
    return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
};

const CoinGraph: React.FunctionComponent<ICoinProps> = ({ priceData }) => {
    const data = priceData.map((price_collection) =>
        Number(price_collection.price)
    );

    // TODO: Add types to label callback

    const chartOptions = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                boxHeight: 80,
                boxWidth: 60,
                mode: ('index' as 'index'),
                intersection: false,
                callbacks: {
                    title: function(tooltipItem: any) {
                        console.log(tooltipItem)
                        return "Bitcoin"
                    },
                    // afterTitle: () => "19 Jan 2023",
                    // label: function(context: any) {
                    //     return `${context.dataset.label.toString()}`;
                    // },
                }
            }
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

export const CoinPage: React.FunctionComponent<{}> = () => {
    const { id } = useParams();
    // TODO: use AppContext to get coin data so that it accurately reflects.
    // map over array and use matching Coin object info
    const data = (useContext(AppContext) as MSCProps)?.["data"] as Coin[];
    
    const coin: Coin = data.filter((coin) => coin.id == id)[0];


    // TODO: find a morex efficient way to do this
    const coinGeckoAliases: string[] = Object.values((aliases as object));
    const coinGeckoAliasEntries: [string, string][] = Object.entries((aliases as object));

    const idx: number = coinGeckoAliases.indexOf(id as string);

    const coinGeckoId = (coinGeckoAliasEntries.at(idx) as [string, string]).at(0);

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
            const response = await fetch(`http://localhost:3000/coin/${id}`);
            const data = await response.json();
            setCoinInfo({
                name: data.name,
                description: data.description,
                upvotes: data.upvotes,
                categories: data.categories,
                genesisDate: data.date,
                image: data.image,
                symbol: data.symbol,
                page: data.page,
                rank: data.rank,
            } as CoinInfo);
        };

        const fetchNewsData = async (): Promise<void> => {
            const symbol = symbols[(id as string).toLowerCase()];
            const response = await fetch(
                `${CRYPTO_PANIC_BASE_URL}/posts/?auth_token=${CRYPTO_PANIC_AUTH_TOKEN}&currencies=${symbol}`
            );
            const data = await response.json();

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
                <div className="w-3/4 h-fit p-8 bg-[rgb(22,22,22)] rounded-2xl border-neutral-800 border-[2px]">
                    <CoinGraph priceData={priceData} />
                </div>
                <div className="w-1/4 h-full bg-[rgb(22,22,22)] rounded-2xl overflow-auto no-scroll flex flex-col gap-y-4 p-2 border-neutral-800 border-[2px]">
                    {newsBlocks}
                </div>
            </div>
            <div className="w-full h-fit flex flex-col gap-y-6 pt-6">
                <div className="flex items-center gap-x-2 h-12">
                    <h1 className="text-5xl font-heading">#{coinInfo?.rank}</h1>
                    <img src={coinInfo?.image} alt="" className="h-4/5 object-contain self-start" />
                    <h1 className="text-5xl font-heading">{coinInfo?.name}</h1>
                    <h1 className="text-md font-heading">{coinInfo?.symbol?.toUpperCase()}</h1>
                </div>
                <div className="flex flex-col gap-y-6">
                    <h1 className="text-3xl">${roundedDecimalAsString(coin.current_price)}</h1>
                    <p>{coinInfo?.description}</p>
                </div>
            </div>
        </>
    );
};

import {
    useEffect,
    useState,
    useContext,
    useRef,
    MutableRefObject,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import {
    CategoryScale,
    ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { App, AppContext, RealTimeContext } from "./App";
import {
    aliases,
    CurrencyPill,
    SectionHeading,
} from "./components/ui/Display";
import { useDraggable } from "react-use-draggable-scroll";
import { CBCProps, Coin, CtxTheme, MSChartProps, MSConProps, MSCProps, NBProps, NewsArticle, RTData, theme } from "./client/interfaces";
import React from "react";
import { CircularProgress } from "@mui/material";
Chart.register(CategoryScale);

export const roundDecimal = (num: number): number => {
    const rounded = num.toFixed(4);

    return Number(rounded);
};

export const roundedDecimalAsString = (num: number): string => {
    return num.toFixed(4);
};

export const formatDate = (date: Date): string => {
    const months: string[] = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const getChangeColour = (change: number): string => {
    if (change >= 0.0002) return "stateGood";
    else if (change <= -0.0002) return "stateBad";

    return "stateNeutral";
};

const getChangeSvg = (change: number): string => {
    if (change >= 0.002) return "stateGood";
    else if (change >= 0) return "stateSlightGood";
    else if (change <= -0.002) return "stateBad";
    else return "stateSlightBad";
};

const MarketSummaryChart: React.FunctionComponent<MSChartProps> = ({
    current_price,
    high_24h,
    low_24h,
    price_change_24h,
}) => {
    const data = [
        current_price,
        price_change_24h > 0 ? low_24h : high_24h,
        price_change_24h <= 0 ? low_24h : high_24h,
    ];

    const chartOptions = {
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    const chartData: ChartData<"line"> = {
        labels: ["", "", ""],
        datasets: [
            {
                data,
                borderColor: price_change_24h > 0 ? "#00ff90" : "#fe1b30",
                stepped: false,
            },
        ],
    };

    return (
        <div className="w-6/12 sm:w-7/12 h-full flex justify-center items-end pt-4 bg-[#202020] rounded-2xl">
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

export const EmptyMarketSummaryBlocks = (): JSX.Element => {
    const marketSummaryBlocks: JSX.Element[] = [];
    
    for(let i=0 ;i < 7; i++) {
        marketSummaryBlocks.push(
            <div
                className="h-full w-56 sm:w-[18rem] rounded-3xl shrink-0 flex flex-col p-4 cursor-pointer shadow-lg skeleton skeleton-override"
                draggable={false}
                onDragStart={() => false}
                key={i}
            >
                <CircularProgress color="inherit" />
            </div>
        )
    }

    return (
        <>
            {marketSummaryBlocks}
        </>
    )
};

const MarketSummaryBlock: React.FunctionComponent<Coin> = ({ id, name, symbol, image, current_price, price_change_24h, high_24h, low_24h, colour, }) => {
    const navigate = useNavigate();

    return (
        <div
            className="h-full w-56 sm:w-[18rem] rounded-3xl shrink-0 glass flex flex-col p-4 cursor-pointer shadow-lg"
            draggable={false}
            onDragStart={() => false}
            onClick={() => navigate(`/coin/${aliases[id.toLowerCase()]}`)}
        >
            <div className="h-3/5 w-full">
                <MarketSummaryChart
                    current_price={current_price}
                    high_24h={high_24h as number}
                    low_24h={low_24h as number}
                    price_change_24h={price_change_24h}
                />
            </div>
            <div className="h-2/5 w-full pr-3 flex pt-2">
                <div className="w-1/6 h-full flex items-center">
                    <img
                        src={image}
                        alt=""
                        className="w-[80%] sm:mb-4 rounded-full"
                    />
                </div>
                <div className="w-3/6 h-full">
                    <h1 className="text-xs sm:text-sm font-bold">
                        {name}{" "}
                        <span
                            className={`font-black text-[.6rem] text-${getChangeColour(
                                price_change_24h
                            )}`}
                        >
                            {symbol.toUpperCase()}
                        </span>
                    </h1>
                    <span
                        className={`text-${getChangeColour(
                            price_change_24h
                        )}`}
                    >
                        <img
                            src={`/${getChangeSvg(price_change_24h)}.svg`}
                            alt=""
                            className="w-[.6rem] h-[.6rem] inline-block"
                        />
                        &nbsp;
                        <span
                            className={`text-[.6rem] sm:text-xs font-bold text-${getChangeColour(
                                price_change_24h
                            )}`}
                        >
                            {price_change_24h}%
                        </span>
                    </span>
                </div>
                <div className="w-2/6 h-full flex">
                    <span
                        className={`text-xs sm:text-base flicker ${colour}_flicker`}
                    >
                        ${current_price}
                    </span>
                </div>
            </div>
        </div>
    );
};

export const MarketSummaryContainer: React.FunctionComponent<MSConProps> = ({ limit }) => {
    const msContainerRef = useRef<HTMLDivElement | null>(null);
    const { events } = useDraggable(msContainerRef as MutableRefObject<HTMLDivElement>);

    const data: Coin[] = (useContext(AppContext) as MSCProps)?.["data"] as Coin[];

    const { currency, price } = (useContext(RealTimeContext) as RTData)?.["update"];

    const [currentPrice, setCurrentPrice] = useState<number>(price);
    const [priceChangeColour, setPriceChangeColour] = useState<"green" | "red">(
        "green"
    );

    useEffect(() => {
        setCurrentPrice((prev) => {
            if (prev > price) setPriceChangeColour("red");
            else setPriceChangeColour("green");

            return price;
        });
    }, [currency, price]);

    const marketSummaryBlocks: JSX.Element[] | undefined = data
        ?.filter((coin, index) => index < limit)
        ?.map(({ id, name, symbol, image, current_price, price_change_24h, high_24h, low_24h, }, idx) => {
                return (
                    <MarketSummaryBlock
                        id={id}
                        name={name}
                        symbol={symbol}
                        image={image}
                        current_price={roundDecimal(
                            name.toLowerCase() === currency.toLowerCase()
                                ? price
                                : current_price
                        )}
                        price_change_24h={roundDecimal(
                            price_change_24h / current_price
                        )}
                        high_24h={high_24h}
                        low_24h={low_24h}
                        idx={idx}
                        colour={
                            name.toLowerCase() === currency.toLowerCase()
                                ? priceChangeColour
                                : undefined
                        }
                        key={idx}
                    />
                );
            }
        );

    return (
        <>
            <div
                className="w-full h-36 sm:h-48 flex overflow-auto gap-4 no-scroll"
                ref={msContainerRef}
                {...events}
            >
                {data.length > 0 ? marketSummaryBlocks : <EmptyMarketSummaryBlocks />}
            </div>
        </>
    );
};

const CurrencyBlock: React.FunctionComponent<Coin> = ({ id, name, symbol, image, current_price, price_change_24h, idx, colour }) => {
    const coinAlias: string = aliases[id.toLowerCase()];
    const coinURL = coinAlias === "NONE" ? "" : `/coin/${coinAlias}`;

    return (
        <>
            <Link to={coinURL}>
                <div className="w-full h-20 sm:h-12 bg-baseColour hover:bg-[#323232] rounded-lg grid grid-cols-4 grid-rows-1 max-sm:grid-rows-3 px-4">
                    <div className="h-full flex items-center gap-x-4 col-span-1 max-sm:row-span-2">
                        <span className="text-stateNeutral text-[.6rem] md:text-xs">
                            {(idx as number) + 1}.
                        </span>
                        <img
                            src={image}
                            alt=""
                            className="h-[70%] object-contain rounded-full"
                        />
                        <span className="font-bold truncate text-sm min-w-fit sm:w-[80%]">
                            {name}
                        </span>
                    </div>
                    <div className="h-full flex items-center text-center col-span-1 max-sm:col-span-3 max-sm:row-span-2 max-sm:col-start-3 max-sm:text-right">
                        <span className="text-[.5rem] md:text-[.6rem] font-black w-[80%]">
                            {symbol.toUpperCase()}
                        </span>
                    </div>
                    <div className="h-full flex items-center col-span-1 max-sm:col-span-2 max-sm:pl-8 max-sm:items-start">
                        <span className={`text-sm flicker ${colour}_flicker`}>
                            ${roundedDecimalAsString(current_price)}
                        </span>
                    </div>
                    <div className="w-full flex items-center justify-start col-span-1 max-sm:items-start col-start-4">
                        <span
                            className={`text-${getChangeColour(
                                price_change_24h
                            )}`}
                        >
                            <img
                                src={`/${getChangeSvg(price_change_24h)}.svg`}
                                alt=""
                                className="w-[.6rem] h-[.6rem] inline-block"
                            />
                            &nbsp;
                            <span
                                className={`text-[.65rem] md:text-sm font-bold text-${getChangeColour(
                                    price_change_24h
                                )}`}
                            >
                                {roundedDecimalAsString(
                                    price_change_24h / current_price
                                )}
                                %
                            </span>
                        </span>
                    </div>
                </div>
            </Link>
        </>
    );
};

export const CurrencyBlockContainer: React.FunctionComponent<CBCProps> = ({ limit }) => {
    const data = (useContext(AppContext) as MSCProps)?.["data"] as Coin[];

    const { currency, price } = (useContext(RealTimeContext) as RTData)?.["update"];

    const [currentPrice, setCurrentPrice] = useState<number>(price);
    const [priceChangeColour, setPriceChangeColour] = useState<"green" | "red">(
        "green"
    );

    useEffect(() => {
        setCurrentPrice((prev) => {
            if (prev > price) setPriceChangeColour("red");
            else setPriceChangeColour("green");

            return price;
        });
    }, [currency, price]);

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if(data.length > 0) setLoading(false);

        return () => {};
    }, [data]);

    const currencyBlocks: JSX.Element[] | undefined = data
        ?.filter((coin, index) => index < limit)
        ?.map(({ id, name, symbol, image, current_price, price_change_24h }, idx) => {
                return (
                    <CurrencyBlock
                        id={id}
                        name={name}
                        symbol={symbol}
                        image={image}
                        current_price={roundDecimal(
                            name.toLowerCase() === currency.toLowerCase() ?
                            price : current_price)
                        }
                        price_change_24h={roundDecimal(price_change_24h)}
                        idx={idx}
                        colour={
                            name.toLowerCase() === currency.toLowerCase()
                                ? priceChangeColour
                                : undefined
                        }
                        key={idx}
                    />
                );
            }
        );

    return (
        <>
            <div className={`glass w-full rounded-2xl flex flex-col gap-y-1 p-4 skeleton min-h-[60vh] ${loading ? 'skeleton-override' : ''}`}>
                {loading ? <CircularProgress color="inherit" /> : currencyBlocks}
            </div>
        </>
    );
};

export const NewsBlock: React.FunctionComponent<NewsArticle> = ({ kind, source, title, url, currencies, created_at, }) => {
    const publisher = source.title;
    let currencyPills: JSX.Element[] | undefined;

    if (currencies) {
        currencyPills = currencies
            .filter(({ code }) => code.indexOf("_") === -1)
            .map(({ code, title }, idx) => {
                return (
                    <CurrencyPill
                        text={code}
                        id={title.toLowerCase()}
                        key={idx}
                    />
                );
            });
    }

    return (
        <Link to={url} target="_blank">
            <div className="h-28 sm:h-32 glass p-6 rounded-2xl flex flex-col justify-around">
                <div>
                    <h1 className="text-[.8rem] sm:text-sm font-bold truncate">
                        {title}
                    </h1>
                </div>
                <div className="flex gap-x-2 sm:gap-x-1">{currencyPills}</div>
                <div>
                    <h1 className="text-[.7rem] sm:text-xs">
                        {publisher} <span></span> Published{" "}
                        {formatDate(new Date(created_at as string))}
                    </h1>
                </div>
            </div>
        </Link>
    );
};

const NewsBlockContainer = (): JSX.Element => {
    const data = (useContext(AppContext) as NBProps)?.["newsData"] as NewsArticle[];

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if(data.length > 0) setLoading(false);

        return () => {};
    }, [data]);

    const newsBlocks = data
        .filter((article, idx) => idx < 4)
        .map(({ kind, source, title, url, currencies, created_at, }: NewsArticle, key) => {
                return (
                    <NewsBlock
                        kind={kind}
                        source={source}
                        title={title}
                        url={url}
                        currencies={currencies}
                        created_at={created_at}
                        key={key}
                    />
                );
            }
        );

    return (
        <div className={`bg-[rgb(22,22,22)] w-full rounded-2xl flex flex-col gap-y-1 p-4 skeleton min-h-[60vh] ${loading ? 'skeleton-override' : ''}`}>
            {loading ? <CircularProgress color="inherit" /> : newsBlocks}
        </div>
    );
};

export const Index: React.FunctionComponent<{}> = () => {
    const data = (useContext(AppContext) as MSCProps)?.["data"] as Coin[];
    const theme = (useContext(AppContext) as CtxTheme)?.["theme"] as theme;

    // TODO: figure out why this keeps printing:
    // is context constanly updating? why?
    console.log(theme)

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if(data.length > 0) setLoading(false);
    }, [data]);

    return (
        <>
            <SectionHeading text="Market Summary" primary={false} />
            <MarketSummaryContainer limit={7} />
            <div className={`flex flex-col h-fit gap-x-4 ${theme}`}>
                <div className="w-full h-fit overflow-hidden">
                    <SectionHeading text="Top Cryptocurrencies" primary={false} />
                    <CurrencyBlockContainer limit={10} />
                    <Link
                        to="/coins"
                        className={`${loading ? 'hidden' : 'block'}`}
                    >
                        <div className="w-12 h-12 flex justify-center items-center rounded-full glass mx-auto mt-2">
                            <img src="/public/arrowDownHgt.svg" className="w-4 object-contain" />
                        </div>
                    </Link>
                </div>
                <div className="w-full h-fit overflow-hidden">
                    <SectionHeading text="Headlines" primary={false} />
                    <NewsBlockContainer />
                </div>
            </div>
        </>
    );
};

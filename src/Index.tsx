import { createContext, useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import {
    CategoryScale,
    ChartData,
    ChartOptions,
    ChartTypeRegistry,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { AppContext, Coin } from "./App";
import { PrimaryButton, SectionHeading } from "./components/ui/Display";
Chart.register(CategoryScale);

const roundDecimal = (price: number): number => {
    return price < 1 ? Number(price.toFixed(4)) : Number(price.toFixed(2));
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

export interface MSChartProps {
    current_price: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
}

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
        <div className=" w-7/12 h-full flex justify-center items-end pt-4 bg-[#202020] rounded-2xl">
            <Line className="" data={chartData} options={chartOptions} />
        </div>
    );
};

const MarketSummaryBlock: React.FunctionComponent<Coin> = ({
    id,
    name,
    symbol,
    image,
    current_price,
    price_change_24h,
    high_24h,
    low_24h,
}) => {
    return (
        <>
            <div className="h-full w-[18rem] rounded-3xl shrink-0 bg-[rgb(22,22,22)] flex flex-col p-4">
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
                            className="w-[80%] mb-4 rounded-full"
                        />
                    </div>
                    <div className="w-3/6 h-full">
                        <h1 className="font-bold">
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
                            <img src={`/public/${getChangeSvg(price_change_24h)}.svg`} alt="" className="w-[.6rem] h-[.6rem] inline-block"/>
                            &nbsp;
                            <span className={`text-xs font-bold text-${getChangeColour(
                                price_change_24h
                            )}`}>{price_change_24h}%</span>
                        </span>
                    </div>
                    <div className="w-2/6 h-full flex">
                        <span className="text-stateNeutral">
                            ${current_price}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

const MarketSummaryContainer: React.FunctionComponent<{}> = () => {
    const data = useContext(AppContext)?.["data"] as Coin[];

    const marketSummaryBlocks: JSX.Element[] | undefined = data
        ?.filter((coin, index) => index < 7)
        ?.map(
            (
                {
                    id,
                    name,
                    symbol,
                    image,
                    current_price,
                    price_change_24h,
                    high_24h,
                    low_24h,
                },
                idx
            ) => {
                return (
                    <MarketSummaryBlock
                        id={id}
                        name={name}
                        symbol={symbol}
                        image={image}
                        current_price={roundDecimal(current_price)}
                        price_change_24h={roundDecimal(
                            price_change_24h / current_price
                        )}
                        high_24h={high_24h}
                        low_24h={low_24h}
                        idx={idx}
                    />
                );
            }
        );

    return (
        <>
            <div className="container h-48 flex overflow-auto gap-4 no-scroll">
                {marketSummaryBlocks}
            </div>
        </>
    );
};

const CurrencyBlock: React.FunctionComponent<Coin> = ({
    id,
    name,
    symbol,
    image,
    current_price,
    price_change_24h,
    idx,
}) => {
    return (
        <>
            <Link to="/">
                <div className="w-full h-12 bg-base rounded-lg flex items-center px-4 gap-x-3">
                    <div className="w-fit h-full flex justify-end items-center">
                        <span className="text-stateNeutral text-xs">{idx as number+1}.</span>
                    </div>
                    <div className="w-1/12 h-full flex justify-center items-center">
                        <img src={image} alt="" className="h-[70%] object-contain" />
                    </div>
                    <div className="w-4/12 h-full flex items-center">
                        <span className="font-bold">{name}</span>
                        &nbsp;
                        &nbsp;
                        <span className="text-[.6rem] font-black">{symbol.toUpperCase()}</span>
                    </div>
                    <div className="w-4/12 h-full mr-24 flex items-center">
                        <span className="ml-[50%] text-left text-stateNeutral">${current_price}</span>
                    </div>
                    <div className="w-4/12 h-full ml-24 flex items-center justify-start">
                    <span
                            className={`text-${getChangeColour(
                                price_change_24h
                            )}`}
                        >
                            <img src={`/public/${getChangeSvg(price_change_24h)}.svg`} alt="" className="w-[.6rem] h-[.6rem] inline-block"/>
                            &nbsp;
                            <span className={`text-xs font-bold text-${getChangeColour(
                                price_change_24h
                            )}`}>{roundDecimal(price_change_24h/current_price)}%</span>
                        </span>
                    </div>
                </div>
            </Link>
        </>
    );
};

const CurrencyBlockContainer: React.FunctionComponent<{}> = () => {
    const [blockCount, setBlockCount] = useState<number>(6);
    const data = useContext(AppContext)?.["data"] as Coin[];

    const currencyBlocks: JSX.Element[] | undefined = data
        ?.filter((coin, index) => index < blockCount)
        ?.map(
            (
                { id, name, symbol, image, current_price, price_change_24h },
                idx
            ) => {
                return (
                    <CurrencyBlock
                        id={id}
                        name={name}
                        symbol={symbol}
                        image={image}
                        current_price={roundDecimal(current_price)}
                        price_change_24h={roundDecimal(price_change_24h)}
                        idx={idx}
                        key={`CURRENCY_BLOCK_${idx}`}
                    />
                );
            }
        );

    return (
        <>
            <div className="bg-[rgb(22,22,22)] w-full rounded-2xl flex flex-col gap-y-1 p-4">
                {currencyBlocks}
            </div>
        </>
    );
};

export const Index: React.FunctionComponent<{}> = () => {
    return (
        <>
            <SectionHeading text="Market Summary" primary={false} />
            <MarketSummaryContainer />
            <div className="flex h-[28rem] gap-x-4">
                <div className="w-1/2 h-full overflow-hidden">
                    <SectionHeading text="Cryptocurrencies" primary={false} />
                    <CurrencyBlockContainer />
                </div>
                <div className="w-1/2">
                    <SectionHeading text="Headlines" primary={false} />
                    <CurrencyBlockContainer />
                </div>
            </div>
        </>
    );
};

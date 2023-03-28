import { createContext, useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Chart from 'chart.js/auto';
import { CategoryScale, ChartData, ChartOptions, ChartTypeRegistry } from 'chart.js';
import { Line } from "react-chartjs-2";
import { AppContext, Coin } from "./App";
Chart.register(CategoryScale);


const roundDecimal = (price: number): number => {
    return price<1 ? Number(price.toFixed(4)) : Number(price.toFixed(2))
};

export interface MSChartProps {
    current_price: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
};

const MarketSummaryChart: React.FunctionComponent<MSChartProps> = ({ current_price, high_24h, low_24h, price_change_24h }) => {
    const data = [
        current_price,
        price_change_24h>0 ? low_24h : high_24h,
        price_change_24h<=0 ? low_24h : high_24h,
        current_price
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
            },
        }
    };

    const chartData: ChartData<"line"> = {
        labels: ['', '', '', ''],
        datasets: [{
            data,
            tension: 0.1,
            borderColor: 'rgb(116, 251, 155)',
            stepped: false,
            
        },
    ],
    };

    return (
        <Line className="" data={chartData} options={chartOptions} />
    );
};

const MarketSummaryBlock: React.FunctionComponent<Coin> = ({ id, name, symbol, image, current_price, price_change_24h, high_24h, low_24h }) => {
    
    return (
        <>
            <div className="h-48">
            <MarketSummaryChart
                current_price={current_price}
                high_24h={high_24h as number}
                low_24h={low_24h as number}
                price_change_24h={price_change_24h}
            />
            </div>
            <span>{id}</span>
            <br />
            <span>{name}</span>
            <br />
            <span>{symbol}</span>
            <br />
            <span>{image}</span>
            <br />
            <span>{current_price}</span>
            <br />
            <span>{price_change_24h}</span>
            <br />
            <span>{high_24h}</span>
            <br />
            <span>{low_24h}</span>
            <br />
            <br />
        </>
    );
};

const MarketSummaryContainer: React.FunctionComponent<{}> = () => {
    const data = useContext(AppContext)?.['data'] as Coin[];

    const marketSummaryBlocks: (JSX.Element[] | undefined) = data?.splice(0,7)?.map(({ id, name, symbol, image, current_price, price_change_24h, high_24h, low_24h }, idx) => {
        return (
            <MarketSummaryBlock
                id={id}
                name={name}
                symbol={symbol}
                image={image}
                current_price={roundDecimal(current_price)}
                price_change_24h={roundDecimal(price_change_24h/current_price)}
                high_24h={high_24h}
                low_24h={low_24h}
                idx={idx}
            />
        )
    });

    return (
        <>
            <span>{marketSummaryBlocks}</span>
        </>
    );
};

const CurrencyBlock: React.FunctionComponent<Coin> = ({ id, name, symbol, image, current_price, price_change_24h, idx }) => {
    return (
        <>
            <Link to="/">
                <span>{idx as number + 1}.</span>
                <br />
                <span>{image}</span>
                <br />
                <span>{name}</span>
                <br />
                <span>{symbol}</span>
                <br />
                <span>{current_price}</span>
                <br />
                <span>{price_change_24h}</span>
                <br />
                <br />
            </Link>
        </>
    );
};

const CurrencyBlockContainer: React.FunctionComponent<{}> = () => {
    const [blockCount, setBlockCount] = useState<number>(6);
    const data = useContext(AppContext)?.['data'] as Coin[];

    const currencyBlocks: (JSX.Element[] | undefined) = data?.splice(0, blockCount)?.map(({ id, name, symbol, image, current_price, price_change_24h }, idx) => {
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
        )
    });

    return (
        <>
            {currencyBlocks}
        </>
    );
};


export const Index: React.FunctionComponent<{}> = () => {

    return (
        <>
            <MarketSummaryContainer />
        </>
    );
};
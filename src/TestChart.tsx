import { Line } from "react-chartjs-2";
import { ChartData } from "chart.js";
import { ChartOptions } from "chart.js";
import { useState } from "react";
import { TooltipModel, Chart } from "chart.js";

interface Tooltip {
    opacity: number;
    top: number;
    left: number;
    right: number;
    date: string;
    value: string;
}

const MSChart = () => {
    const [tooltip, setTooltip] = useState<Tooltip>({
        opacity: 0,
        top: 0,
        left: 0,
        right: 0,
        date: "",
        value: ""
    });

    const [chartMoveEvent, setChartMouseMoveEvent] = useState<React.MouseEvent<HTMLDivElement, MouseEvent> | null>();

    /*
    const chartOptions: ChartOptions<"line"> = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                boxHeight: 100,
                boxWidth: 100,
                mode: ('index' as 'index'),
                intersect: false,
                displayColors: false,
                callbacks: {
                    title: () => "Bitcoin",
                    footer: (tooltipItem: any) => "$" + tooltipItem[0].raw,
                    label: (tooltipItem: any) => tooltipItem.label,
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
    */

    const generateTooltip = (tooltipModel: TooltipModel<"line">, chart: Chart) => {
        if(tooltipModel.opacity !== 0) {
            setTooltip((prev) => ({ ...prev, opacity: 0 }));
        }

        const position = chart.canvas.getBoundingClientRect();

        const { clientX } = (chartMoveEvent as React.MouseEvent<HTMLDivElement, MouseEvent>);

        console.log(clientX)
    };

    const chartOptions: ChartOptions<"line"> = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
                external: ({ tooltip: tooltipModel, chart }): void => generateTooltip(tooltipModel, chart),
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

    const data: number[] = [0,1,2,3,4,5,6,7,1,2,1,8,21,21,12,3];

    const labels: string[] = [];
    for (const idx in data) {
        labels.push("May " + (idx+1));
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
    }

    return (
        <div
            className="w-full h-full"
            onMouseMove={(e) => setChartMouseMoveEvent(e)}
        >
            <Line data={chartData} options={chartOptions} />
        </div>
    );
}

export const TestChart = () => {
    return (
        <div className="w-full h-72">
            <MSChart />
        </div>
    );
}
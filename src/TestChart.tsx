import { Line } from "react-chartjs-2";
import { ChartData, TooltipLabelStyle } from "chart.js";
import { ChartOptions } from "chart.js";
import { useEffect, useState } from "react";
import { TooltipModel, Chart, TooltipItem, PointStyle } from "chart.js";

const MSChart = () => {
    ///*
    const chartOptions: ChartOptions<"line"> = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: ('index' as 'index'),
                intersect: false,
                backgroundColor: 'blue',
                padding: { left: 10, right: 60, y: 10 },
                displayColors: false,
                callbacks: {
                    title: () => "Bitcoin",
                    footer: (tooltipItem: TooltipItem<"line">[]) => "$" + tooltipItem[0].raw,
                    label: (tooltipItem: TooltipItem<"line">) => tooltipItem.label,
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
        <div className="w-full h-full">
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
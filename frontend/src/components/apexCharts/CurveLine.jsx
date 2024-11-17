import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const CurveLine = () => {
    useEffect(() => {
        const chartElement = document.querySelector('#hs-single-line-chart');

        // Chart options
        const options = {
            chart: {
                height: 250,
                type: 'line',
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            series: [
                {
                    name: 'Sales',
                    data: [0, 27000, 25000, 27000, 40000]
                }
            ],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 4
            },
            title: {
                show: false
            },
            legend: {
                show: false
            },
            grid: {
                borderColor: '#e5e7eb',
                padding: {
                    top: -20,
                    right: 0
                }
            },
            xaxis: {
                type: 'category',
                categories: [
                    '25 January 2023',
                    '28 January 2023',
                    '31 January 2023',
                    '1 February 2023',
                    '3 February 2023'
                ],
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    offsetY: 5,
                    style: {
                        colors: '#9ca3af',
                        fontSize: '13px',
                        fontFamily: 'Inter, ui-sans-serif',
                        fontWeight: 400
                    }
                }
            },
            yaxis: {
                min: 0,
                max: 40000,
                tickAmount: 4,
                labels: {
                    style: {
                        colors: '#9ca3af',
                        fontSize: '12px',
                        fontFamily: 'Inter, ui-sans-serif',
                        fontWeight: 400
                    },
                    formatter: (value) => (value >= 1000 ? `${value / 1000}k` : value)
                }
            },
            tooltip: {
                shared: true,
                intersect: false,
            }
        };

        // Create a new chart instance
        const chart = new ApexCharts(chartElement, options);
        chart.render();

        // Cleanup on unmount
        return () => {
            chart.destroy();
        };
    }, []);

    return (
        <>
            <div className='pt-20'>
            <div id="hs-single-line-chart"></div>
            </div>
        </>
    );
};

export default CurveLine;

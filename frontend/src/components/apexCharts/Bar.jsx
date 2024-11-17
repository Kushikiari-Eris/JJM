import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const Bar = () => {
    useEffect(() => {
        const chartElement = document.querySelector('#hs-multiple-bar-charts');
        const options = {
            chart: {
                type: 'bar',
                height: '100%',
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            series: [
                {
                    name: 'Income',
                    data: [23000, 44000, 55000, 57000, 56000, 61000, 58000, 63000, 60000, 66000, 34000, 78000]
                },
                {
                    name: 'Outcome',
                    data: [17000, 76000, 85000, 101000, 98000, 87000, 105000, 91000, 114000, 94000, 67000, 66000]
                }
            ],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '16px',
                    borderRadius: 0
                }
            },
            legend: {
                show: false
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 8,
                colors: ['transparent']
            },
            xaxis: {
                categories: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        colors: '#9ca3af',
                        fontSize: '13px',
                        fontFamily: 'Inter, ui-sans-serif',
                        fontWeight: 400
                    },
                    offsetX: -2,
                }
            },
            yaxis: {
                labels: {
                    align: 'left',
                    style: {
                        colors: '#9ca3af',
                        fontSize: '13px',
                        fontFamily: 'Inter, ui-sans-serif',
                        fontWeight: 400
                    },
                    formatter: (value) => (value >= 1000 ? `${value / 1000}k` : value)
                }
            },
            tooltip: {
                y: {
                    formatter: (value) => `$${value >= 1000 ? `${value / 1000}k` : value}`
                }
            },
            responsive: [{
                breakpoint: 568,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: '14px'
                        }
                    },
                    xaxis: {
                        labels: {
                            style: {
                                fontSize: '11px',
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            style: {
                                fontSize: '11px',
                            }
                        }
                    }
                },
            }]
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
            {/* Legend Indicator */}
            <div className="flex justify-center sm:justify-end items-center gap-x-4 mb-3 sm:mb-6">
                <div className="inline-flex items-center">
                    <span className="size-2.5 inline-block bg-blue-600 rounded-sm me-2"></span>
                    <span className="text-[13px] text-gray-600 dark:text-neutral-400">Income</span>
                </div>
                <div className="inline-flex items-center">
                    <span className="size-2.5 inline-block bg-gray-300 rounded-sm me-2 dark:bg-neutral-700"></span>
                    <span className="text-[13px] text-gray-600 dark:text-neutral-400">Outcome</span>
                </div>
            </div>
            {/* End Line Indicator */}

            {/* Apex Bar Charts */}
            <div id="hs-multiple-bar-charts" style={{ height: '300px', width: '100%' }}></div>
        </>
    );
};

export default Bar;

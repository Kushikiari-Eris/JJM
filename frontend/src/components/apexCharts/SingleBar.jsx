import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

const SingleBar = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Define chart options
        const options = {
            chart: {
                type: 'bar',
                height: 300,
                toolbar: { show: false },
                zoom: { enabled: false },
            },
            series: [{
                name: 'Sales',
                data: [23000, 44000, 55000, 57000, 56000, 61000, 58000, 63000, 60000, 66000, 34000, 78000]
            }],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '16px',
                    borderRadius: 0
                }
            },
            legend: { show: false },
            dataLabels: { enabled: false },
            stroke: {
                show: true,
                width: 8,
                colors: ['transparent']
            },
            xaxis: {
                categories: [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ],
                labels: {
                    style: {
                        colors: '#9ca3af',
                        fontSize: '13px',
                        fontFamily: 'Inter, ui-sans-serif',
                        fontWeight: 400
                    },
                    offsetX: -2,
                    formatter: (title) => title.slice(0, 3)
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
                    chart: { height: 300 },
                    plotOptions: { bar: { columnWidth: '14px' } },
                    xaxis: {
                        labels: {
                            style: {
                                fontSize: '11px',
                                fontFamily: 'Inter, ui-sans-serif',
                            },
                            offsetX: -2,
                        }
                    },
                    yaxis: {
                        labels: {
                            style: {
                                fontSize: '11px',
                                fontFamily: 'Inter, ui-sans-serif',
                            },
                        }
                    }
                }
            }]
        };

        // Initialize chart
        const chart = new ApexCharts(chartRef.current, options);
        chart.render();

        // Cleanup on unmount
        return () => {
            chart.destroy();
        };
    }, []);

    return <div id="hs-single-bar-chart" ref={chartRef}></div>;
}

export default SingleBar;

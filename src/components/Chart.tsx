import React, { useEffect, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface ChartProps {
    csv_filename: string;
}

const Chart = ({ csv_filename }: ChartProps) => {
    const [series_data, setData] = useState<Record<string, number>[][]>([]);

    useEffect(() => {
        // Fetch the CSV file data when the component mounts
        ReadRemoteFile();
    }, []);

    function ReadRemoteFile() {
        const { readRemoteFile } = usePapaParse();
        const folder = csv_filename.startsWith("measurements_") ? "measurements/" : "calibrations/";
        const url = "http://localhost:9000/magneto/" + folder + csv_filename;

        console.log("Test: " + csv_filename);

        const handleReadRemoteFile = () => {
            try {
                readRemoteFile(url, {
                    complete: (results) => {
                        const csvdata: string[][] = results.data.map((innerArray: unknown) =>
                            (innerArray as unknown[]).map((item: unknown) => String(item))
                        );

                        let header = csvdata[0];
                        let series_array = [];

                        for (let i = 1; i < header.length; i++) {
                            let series: Record<string, number>[] = [];

                            for (let j = 1; j < csvdata.length - 1; j++) {
                                const entry: Record<string, number> = {};
                                const row_data: string[] = csvdata[j];

                                entry[header[0]] = Number(row_data[0]);
                                entry[header[i]] = Number(row_data[i]);
                                series.push(entry);
                            }

                            series_array.push(series);
                        }

                        setData(series_array);
                    },
                    download: true
                });
            } catch (error) {
                console.log(error);
            }
        };

        return handleReadRemoteFile();
    }

    useEffect(() => {
        if (series_data.length > 0) {
            createChart();
        }
    }, [series_data]);

    const createChart = () => {
        let root = am5.Root.new("chartdiv");

        // Set themes
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        // Create chart
        let chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            maxTooltipDistance: 0,
            pinchZoomX: true
        }));

        // Create axes
        let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            min: 0.0,
            max: 1.1,
            renderer: am5xy.AxisRendererX.new(root, {}),
            tooltip: am5.Tooltip.new(root, {})
        }));

        let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
        }));

        // Add series
        let seriesArray: am5xy.LineSeries[] = [];
        series_data.forEach((data, i) => {
            const y_axis_name = Object.keys(data[0])[1];

            let series = chart.series.push(am5xy.LineSeries.new(root, {
                name: y_axis_name,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: y_axis_name,
                valueXField: "position",
                legendValueText: "{valueY}",
                tooltip: am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: "{valueY}"
                })
            }));

            seriesArray.push(series);
            console.log("Data: ");
            console.log(data);
            console.log(typeof data);
            series.data.setAll(data);

            // Make stuff animate on load
            series.appear();
        });

        // Add cursor
        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "none"
        }));
        cursor.lineY.set("visible", false);

        // Add scrollbar
        chart.set("scrollbarX", am5.Scrollbar.new(root, {
            orientation: "horizontal"
        }));

        chart.set("scrollbarY", am5.Scrollbar.new(root, {
            orientation: "vertical"
        }));

        // Add legend
        let legend = chart.rightAxesContainer.children.push(am5.Legend.new(root, {
            width: 200,
            paddingLeft: 15,
            height: am5.percent(100),
            verticalScrollbar: am5.Scrollbar.new(root, {
                orientation: "vertical"
            })
        }));

        // When legend item container is hovered, dim all the series except the hovered one
        legend.itemContainers.template.events.on("pointerover", function (e) {
            let itemContainer = e.target;

            // As series list is data of a legend, dataContext is series
            let series = itemContainer.dataItem?.dataContext;
            let chart_Series = seriesArray;

            chart_Series.forEach(function (chartSeries) {
                if (chartSeries !== series) {
                    chartSeries.strokes.template.setAll({
                        strokeOpacity: 0.15,
                        stroke: am5.color(0x000000)
                    });
                } else {
                    chartSeries.strokes.template.setAll({
                        strokeWidth: 3
                    });
                }
            })
        })

        // When legend item container is unhovered, make all series as they are
        legend.itemContainers.template.events.on("pointerout", function (e) {
            let chart_Series = seriesArray;

            chart_Series.forEach(function (chartSeries) {
                chartSeries.strokes.template.setAll({
                    strokeOpacity: 1,
                    strokeWidth: 1,
                    stroke: chartSeries.get("fill")
                });
            });
        })

        legend.itemContainers.template.set("width", am5.p100);
        legend.valueLabels.template.setAll({
            width: am5.p100,
            textAlign: "right"
        });

        // It's is important to set legend data after all the events are set on template, otherwise events won't be copied
        legend.data.setAll(chart.series.values);

        // Make stuff animate on load
        chart.appear(1000, 100);

        return chart;
    };

    return (
        <div>
            <div id="chartdiv" style={{ width: '100%', height: '600px' }}></div>
        </div>
    );
}

export default Chart;

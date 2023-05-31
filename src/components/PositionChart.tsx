import "./PositionChart.css";
import React, { useEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const PositionChart = () => {

    useEffect(() => {
        let root = am5.Root.new("chartdiv");

        // Set themes
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        // Create chart
        let chart = root.container.children.push(am5xy.XYChart.new(root, {
            focusable: true,
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            pinchZoomX: true
        }));

        // Create axes
        let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
            maxDeviation: 0.5,
            groupData: false,
            extraMax: 0.1,
            extraMin: -0.1,
            baseInterval: {
                timeUnit: "millisecond",
                count: 100
            },
            renderer: am5xy.AxisRendererX.new(root, {
                minGridDistance: 50
            }),
            tooltip: am5.Tooltip.new(root, {})
        }));

        let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
        }));

        // Add series
        let series = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Position",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "date",
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal",
                labelText: "{valueY}"
            })
        }));

        function dummyFirstRecord() {
            let firstDate = new Date();
            firstDate.setDate(firstDate.getDate() - 1000);
            firstDate.setHours(0, 0, 0, 0);

            let newDate = new Date(firstDate);
            newDate.setSeconds(newDate.getSeconds());

            return [{
                date: newDate.getTime(),
                value: 0,
            }];
        }

        series.data.setAll(dummyFirstRecord());

        // Add cursor
        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            xAxis: xAxis
        }));
        cursor.lineY.set("visible", false);

        // Update data every 100 ms
        setInterval(function () {
            fetch('http://localhost:9000/magneto/position', {
                method: 'GET'
            })
                .then((response: Response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    return response.json();
                })
                .then((data: any) => {
                    addData(data);
                })
                .catch((error: Error) => {
                    if (error.name === 'AbortError') {
                        console.log('Request was aborted');
                    }
                });
        }, 100)

        let easing = am5.ease.linear;

        function addData(new_position: number) {
            let lastDataItem = series.dataItems[series.dataItems.length - 1];

            let lastValue = lastDataItem.get("valueY");
            let lastDateVal: number = lastDataItem.get("valueX")!;
            let lastDate = new Date(lastDateVal);
            let time = am5.time.add(new Date(lastDate), "millisecond", 100).getTime();

            const historyLength = 3000; //5 minutes
            if (series.data.length === historyLength) {
                series.data.removeIndex(0);
            }

            series.data.push({
                date: time,
                value: new_position
            })

            let newDataItem = series.dataItems[series.dataItems.length - 1];
            newDataItem.animate({
                key: "valueYWorking",
                to: new_position,
                from: lastValue,
                duration: 600,
                easing: easing
            });

            let animation = newDataItem.animate({
                key: "locationX",
                to: 0.5,
                from: -0.5,
                duration: 600
            });

            if (animation) {
                let tooltip = xAxis.get("tooltip");
                if (tooltip && !tooltip.isHidden()) {
                    animation.events.on("stopped", function () {
                        xAxis.updateTooltip();
                    })
                }
            }
        }

        // Make stuff animate on load
        chart.appear(1000, 100);
    }, []);

    return (
        <div className='posheader'>
            <h3>Position</h3>
            <div id="chartdiv" style={{ width: "100%", height: "600px" }}></div>
        </div >
    );
};

export default PositionChart;

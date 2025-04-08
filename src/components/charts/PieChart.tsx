import { useEffect } from "react";
import Highcharts from "highcharts";

const PieChart = () => {
  useEffect(() => {
    Highcharts.chart("container", {
      chart: {
        type: "pie",
        events: {
          render() {
            const chart = this;
            const series = chart.series[0];

            if (!chart.options.chart) return;

            let customLabel = (chart.options.chart as any).customLabel;

            if (!customLabel) {
              customLabel = (chart.options.chart as any).customLabel = chart.renderer
                .label(`<br/><b>30 %</b>`, 100, 50) // Ajoute les coordonnées X et Y
                .css({
                  color: "#000",
                  textAnchor: "middle",
                  fontSize: "16px",
                  background: "#0F123F",
                })
                .add();
            }

            const x = series.center[0] + chart.plotLeft;
            const y = series.center[1] + chart.plotTop - customLabel.attr("height") / 2;

            customLabel.attr({ x, y });
          },
        },
      },
      title: {
        text: "",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          innerSize: "90%",
          dataLabels: {
            enabled: true,
            distance: -20,
            format: "{point.percentage:.0f}%",
            style: {
              fontSize: "0px",
              color: "white",
              textOutline: "none",
            },
          },
        },
      },
      series: [
        {
          type: "pie", // ✅ Ajout du type ici
          name: "Grades",
          colorByPoint: true,
          data: [{ name: "A1", y: 10 }],
          colors: ["#0F123F"],
        },
      ],
    });
  }, []);

  return <div id="container" style={{ width: "100%", height: "265px" }}></div>;
};

export default PieChart;

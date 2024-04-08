import React, { useEffect, useRef, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Linegraph = ({data}) => {
  const [theme, setTheme] = useState(false);
  const dataPoints = data;
  useEffect(() => {
    const checkTheme = () => {
      const body = document.body;
      if (body) {
        const isDarkTheme = body.classList.contains('dark-theme');
        setTheme(isDarkTheme);
      }
    };
    checkTheme();
    document.body.addEventListener('transitionend', checkTheme);
    return () => {
      document.body.removeEventListener('transitionend', checkTheme);
    };
  }, []);
  useEffect(() => {
    const updateChartSize = () => {
      if (chartRef.current && chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.clientWidth;
        const containerHeight = chartContainerRef.current.clientHeight;

        chartRef.current.options.width = containerWidth;
        chartRef.current.options.height = containerHeight;

        chartRef.current.render();
      }
    };
    updateChartSize();
    window.addEventListener('resize', updateChartSize);
    return () => {
      window.removeEventListener('resize', updateChartSize);
    };
  }, [theme]);

  const options = {
    backgroundColor: "rgba(0,0,0,0)",
    theme: theme ? "dark1" : "light1",
    height: "270",
    data: [{
      type: "line",
      color: theme ? "cyan" : "black",
      xValueFormatString: "MMM YYYY",
      yValueFormatString: "#,##0.00",
      dataPoints: dataPoints,
    }]
  };
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  return (
    <div ref={chartContainerRef} className='chart' style={{ width: '100%', height:'100%'}}>
      <CanvasJSChart options={options} onRef={ref => (chartRef.current = ref)} />
    </div>
  );
};

export default Linegraph;
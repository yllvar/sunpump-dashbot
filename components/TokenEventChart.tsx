import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface TokenEvent {
  block_number: number;
  block_timestamp: number;
  event_name: string;
  transaction_id: string;
  _unconfirmed: boolean;
}

interface TokenEventChartProps {
  events: TokenEvent[];
}

const TokenEventChart: React.FC<TokenEventChartProps> = ({ events }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const purchasedEvents = events.filter(event => event.event_name === "TokenPurchased");
        const soldEvents = events.filter(event => event.event_name === "TokenSold");

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const config: ChartConfiguration = {
          type: 'bar',
          data: {
            labels: ['Token Purchased', 'Token Sold'],
            datasets: [{
              label: 'Event Counts',
              data: [purchasedEvents.length, soldEvents.length],
              backgroundColor: ['#4caf50', '#f44336'],
              borderColor: ['#388e3c', '#d32f2f'],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            },
            responsive: true
          }
        };

        chartInstance.current = new Chart(ctx, config);
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [events]);

  return <canvas ref={chartRef} />;
};

export default TokenEventChart;


const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'top' },
    decimation: { enabled: true, algorithm: 'lttb', samples: 100 },
  },
};
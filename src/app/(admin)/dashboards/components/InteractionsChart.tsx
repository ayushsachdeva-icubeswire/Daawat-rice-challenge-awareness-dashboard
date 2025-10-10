import { Card, CardBody, CardHeader } from 'react-bootstrap'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const InteractionsChart = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: 'Likes',
        data: [23, 34, 45, 56, 67, 78, 89, 90, 85, 78, 92, 103],
        color: '#ef4444',
      },
      {
        name: 'Comments',
        data: [12, 18, 23, 28, 35, 42, 48, 55, 52, 47, 58, 65],
        color: '#3b82f6',
      },
      {
        name: 'Shares',
        data: [8, 12, 16, 20, 24, 28, 32, 36, 34, 30, 38, 42],
        color: '#10b981',
      },
      {
        name: 'Views',
        data: [45, 67, 89, 123, 156, 178, 201, 234, 223, 198, 245, 278],
        color: '#8b5cf6',
      },
    ],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#8e8da4',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#8e8da4',
        },
      },
    },
    grid: {
      borderColor: '#f1f3fa',
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 6,
      hover: {
        sizeOffset: 2,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    tooltip: {
      theme: 'dark',
    },
  }

  return (
    <Card>
      <CardHeader>
        <h5 className="card-title mb-0">Interactions Analytics</h5>
      </CardHeader>
      <CardBody>
        <ReactApexChart
          options={chartOptions}
          series={chartOptions.series}
          type="line"
          height={350}
        />
      </CardBody>
    </Card>
  )
}

export default InteractionsChart
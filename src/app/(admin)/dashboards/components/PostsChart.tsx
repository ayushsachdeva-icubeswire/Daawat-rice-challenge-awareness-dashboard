import { Card, CardBody, CardHeader } from 'react-bootstrap'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const PostsChart = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: 'Published Posts',
        data: [5, 8, 12, 15, 18, 22, 25, 28, 32, 35, 38, 42],
        color: '#f59e0b',
      },
      {
        name: 'Draft Posts',
        data: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
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
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
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
        <h5 className="card-title mb-0">Posts Analytics</h5>
      </CardHeader>
      <CardBody>
        <ReactApexChart
          options={chartOptions}
          series={chartOptions.series}
          type="area"
          height={350}
        />
      </CardBody>
    </Card>
  )
}

export default PostsChart
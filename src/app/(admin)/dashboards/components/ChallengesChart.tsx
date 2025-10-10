import { Card, CardBody, CardHeader } from 'react-bootstrap'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const ChallengesChart = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: 'Completed',
        data: [8, 12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45],
        color: '#10b981',
      },
      {
        name: 'In Progress',
        data: [5, 8, 10, 12, 15, 18, 20, 23, 25, 28, 30, 32],
        color: '#3b82f6',
      },
      {
        name: 'Not Started',
        data: [12, 18, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45],
        color: '#6b7280',
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4,
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
        <h5 className="card-title mb-0">Challenges Progress</h5>
      </CardHeader>
      <CardBody>
        <ReactApexChart
          options={chartOptions}
          series={chartOptions.series}
          type="bar"
          height={350}
        />
      </CardBody>
    </Card>
  )
}

export default ChallengesChart
import { Card, CardBody, CardHeader, Spinner } from 'react-bootstrap'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

interface ChallengerGraphData {
  date: string
  Completed: number
  InProgress: number
}

interface ChallengesChartProps {
  challengrsGraphData?: ChallengerGraphData[]
  isLoading?: boolean
  error?: string | null
}

const ChallengesChart = ({ challengrsGraphData, isLoading = false, error = null }: ChallengesChartProps) => {
  // Process the graph data for chart display
  const processChartData = () => {
    if (!challengrsGraphData || challengrsGraphData.length === 0) {
      return {
        categories: ['No Data'],
        completedData: [0],
        inProgressData: [0]
      }
    }

    const categories = challengrsGraphData.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })

    const completedData = challengrsGraphData.map(item => item.Completed)
    const inProgressData = challengrsGraphData.map(item => item.InProgress)

    return {
      categories,
      completedData,
      inProgressData
    }
  }

  const chartData = processChartData()

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
        data: chartData.completedData,
        color: '#10b981',
      },
      {
        name: 'Challenges Taken',
        data: chartData.inProgressData,
        color: '#3b82f6',
      },
    ],
    xaxis: {
      categories: chartData.categories,
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
      show: false,
      position: 'top',
      horizontalAlign: 'right',
    },
    tooltip: {
      theme: 'light',
    },
  }

  return (
    <Card>
      <CardHeader>
        <h5 className="card-title mb-0">Challenges Progress</h5>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading chart data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-danger">
            <IconifyIcon icon="solar:danger-circle-broken" className="fs-48 mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <ReactApexChart
            options={chartOptions}
            series={chartOptions.series}
            type="bar"
            height={350}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default ChallengesChart
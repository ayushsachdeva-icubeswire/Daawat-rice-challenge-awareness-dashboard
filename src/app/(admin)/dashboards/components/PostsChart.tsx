import { Card, CardBody, CardHeader } from 'react-bootstrap'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import Spinner from '@/components/Spinner'
// import { formatNumber } from '@/utils/numberFormat'

interface PostsChartProps {
  postGraphData?: { x: number; y: number }[]
  isLoading?: boolean
  error?: string | null
}

const PostsChart: React.FC<PostsChartProps> = ({ 
  postGraphData = [],
  isLoading = false, 
  error = null 
}) => {
  // Prepare chart data from API response or use fallback data
  const getChartData = () => {
    if (Array.isArray(postGraphData) && postGraphData.length > 0) {
      // Convert timestamps to dates and prepare data for ApexCharts
      const chartData = postGraphData
        .map(point => ({
          timestamp: point.x,
          date: new Date(point.x).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: point.y
        }))
        .sort((a, b) => a.timestamp - b.timestamp)

      return {
        categories: chartData.map(item => item.date),
        publishedData: chartData.map(item => item.value),
        timestamps: chartData.map(item => item.timestamp)
      }
    }
    // Fallback data if API data is not available
    return {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      publishedData: [5, 8, 12, 15, 18, 22, 25, 28, 32, 35, 38, 42],
      timestamps: []
    }
  }

  const chartData = getChartData()

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
        name: 'Posts Count',
        data: chartData.publishedData,
        color: '#f59e0b',
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
      theme: 'light',
    },
  }

  return (
    <Card>
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Post Interactions</h5>
          {/* {dashboardData && (
            <div className="d-flex gap-3 text-muted small">
              <span>Stories: <strong>{dashboardData.totalStories ?? 0}</strong></span>
              <span>Views: <strong>{formatNumber(dashboardData.totalViews)}</strong></span>
              <span>Likes: <strong>{formatNumber(dashboardData.totalLikes)}</strong></span>
            </div>
          )} */}
        </div>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '350px' }}>
            <Spinner />
          </div>
        ) : error ? (
          <div className="d-flex justify-content-center align-items-center text-danger" style={{ height: '350px' }}>
            <div className="text-center">
              <i className="mdi mdi-alert-circle-outline fs-2 mb-2"></i>
              <p className="mb-0">{error}</p>
            </div>
          </div>
        ) : (
          <ReactApexChart
            options={chartOptions}
            series={chartOptions.series}
            type="area"
            height={350}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default PostsChart
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { ExtendedCardsType } from '@/types/dashboard'
interface ExtendedStatCardProps extends ExtendedCardsType {
  onClick?: () => void
}

// Safe chart wrapper component
const SafeChart = ({ options, series, height, type, color }: {
  options: ApexOptions
  series: any[]
  height: number
  type: string
  color: string
}) => {
  try {
    return (
      <ReactApexChart 
        options={options} 
        series={series} 
        height={height} 
        type={type as any} 
      />
    )
  } catch (error) {
    console.error('Chart rendering error:', error)
    return (
      <div style={{ height, backgroundColor: `${color}10` }} className="d-flex align-items-center justify-content-center">
        <span className="text-muted small">Chart error</span>
      </div>
    )
  }
}

const ExtendedStatCard = ({ 
  count, 
  icon, 
  series, 
  title, 
  color = '#7e67fe', 
  trend = 'neutral', 
  trendValue,
  onClick 
}: ExtendedStatCardProps) => {
  // Ensure series data is valid and contains proper numbers
  const chartSeries = Array.isArray(series) && series.length > 0 
    ? series.filter(val => typeof val === 'number' && !isNaN(val))
    : []
  
  // Use fallback data if series is empty or invalid
  const finalSeries = chartSeries.length > 0 ? chartSeries : [0, 0, 0, 0, 0]
  
  // Add error boundary for chart rendering
  if (!Array.isArray(series) || series.length === 0) {
    console.warn('Invalid chart series data for card:', title, series)
  }
  
  const salesChart: ApexOptions = {
    chart: {
      type: 'area',
      height: 50,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    markers: {
      size: 0,
    },
    colors: [color],
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return ''
          },
        },
      },
      marker: {
        show: false,
      },
    },
    fill: {
      opacity: [1],
      type: ['gradient'],
      gradient: {
        type: 'vertical',
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'solar:arrow-up-broken'
      case 'down':
        return 'solar:arrow-down-broken'
      default:
        return 'solar:minus-broken'
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success'
      case 'down':
        return 'text-danger'
      default:
        return 'text-muted'
    }
  }

  return (
    <Card 
      className={`${onClick ? 'cursor-pointer' : ''} hover-shadow transition-all`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <CardBody>
        <Row>
          <Col xs={8}>
            <p className="text-muted mb-1 text-truncate">{title}</p>
            <h3 className="text-dark mt-1 mb-1">{count}</h3>
            {trendValue && (
              <div className="d-flex align-items-center">
                <IconifyIcon 
                  icon={getTrendIcon()} 
                  className={`fs-12 me-1 ${getTrendColor()}`} 
                />
                <span className={`fs-12 ${getTrendColor()}`}>{trendValue}</span>
              </div>
            )}
          </Col>
          <Col xs={4}>
            <div className="ms-auto avatar-md rounded" style={{ backgroundColor: `${color}20` }}>
              <IconifyIcon 
                style={{ padding: '12px' }} 
                icon={icon} 
                className="fs-32 avatar-title" 
                color={color}
              />
            </div>
          </Col>
        </Row>
      </CardBody>
      <SafeChart 
        options={salesChart} 
        series={[{ data: finalSeries }]} 
        height={50} 
        type="area"
        color={color}
      />
    </Card>
  )
}

interface ExtendedCardsProps {
  cardsData: ExtendedCardsType[]
  onCardClick?: (index: number, cardData: ExtendedCardsType) => void
}

const ExtendedCards = ({ cardsData, onCardClick }: ExtendedCardsProps) => {
  // Ensure cardsData is valid
  if (!Array.isArray(cardsData) || cardsData.length === 0) {
    return (
      <Row className="g-3">
        <Col xs={12}>
          <div className="text-center py-4">
            <span className="text-muted">Loading dashboard cards...</span>
          </div>
        </Col>
      </Row>
    )
  }

  return (
    <Row className="g-3">
      {cardsData.map((item, idx) => (
        <Col sm={6} lg={4} key={idx}>
          <ExtendedStatCard 
            {...item} 
            onClick={onCardClick ? () => onCardClick(idx, item) : undefined}
          />
        </Col>
      ))}
    </Row>
  )
}

export default ExtendedCards
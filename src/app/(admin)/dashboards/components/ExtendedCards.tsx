import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { ExtendedCardsType } from '@/types/dashboard'

interface ExtendedStatCardProps extends ExtendedCardsType {
  onClick?: () => void
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
  const salesChart: ApexOptions = {
    chart: {
      type: 'area',
      height: 50,
      sparkline: {
        enabled: true,
      },
    },
    series: [
      {
        data: series,
      },
    ],
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
      <ReactApexChart options={salesChart} series={salesChart.series} height={50} type="area" />
    </Card>
  )
}

interface ExtendedCardsProps {
  cardsData: ExtendedCardsType[]
  onCardClick?: (index: number, cardData: ExtendedCardsType) => void
}

const ExtendedCards = ({ cardsData, onCardClick }: ExtendedCardsProps) => {
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
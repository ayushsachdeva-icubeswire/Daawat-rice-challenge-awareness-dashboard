import { currentYear } from '@/context/constants'
import { Col, Row } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <Row>
          <Col xs={12} className=" text-center">
            {currentYear}&nbsp;© Copyright by Icubeswire.
          </Col>
        </Row>
      </div>
    </footer>
  )
}

export default Footer

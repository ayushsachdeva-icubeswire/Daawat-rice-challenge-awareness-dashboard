import Footer from '@/components/layout/Footer'
import ExtendedCards from './components/ExtendedCards'
import InteractionsList from './components/InteractionsList'
import ChallengesList from './components/ChallengesList'
import PostsList from './components/PostsList'
import InteractionsChart from './components/InteractionsChart'
import ChallengesChart from './components/ChallengesChart'
import PostsChart from './components/PostsChart'
import PageTitle from '@/components/PageTitle'
import { Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { getExtendedCardsData, getRecentInteractions, getActiveChallenges, getRecentPosts } from './mockData'

const page = () => {
  const navigate = useNavigate()
  const extendedCardsData = getExtendedCardsData()

  const handleCardClick = (_: number, cardData: any) => {
    switch (cardData.title) {
      case 'Recent Interactions':
        navigate('/interactions')
        break
      case 'Challenges Taken':
        navigate('/challenges')
        break
      case 'Total Posts':
        navigate('/posts')
        break
      case 'Completed Challenges':
        navigate('/challenges')
        break
      default:
        console.log('Card clicked:', cardData.title)
    }
  }

  return (
    <>
      <PageTitle subName="Daawat" title="Dashboard Analytics" />
      
      {/* Counter Cards */}
      <div className="mb-4">
        <ExtendedCards 
          cardsData={extendedCardsData}
          onCardClick={handleCardClick}
        />
      </div>

      {/* Charts Section */}
      <Row className="mb-4 g-3">
        <Col xl={4} lg={6} md={12}>
          <InteractionsChart />
        </Col>
        <Col xl={4} lg={6} md={12}>
          <ChallengesChart />
        </Col>
        <Col xl={4} lg={12} md={12}>
          <PostsChart />
        </Col>
      </Row>

      {/* Lists Section */}
      <Row className="mb-4 g-3">
        <Col xl={4} lg={6} md={12}>
          <InteractionsList 
            interactions={getRecentInteractions(10)}
            title="Recent Interactions"
            showHeader={true}
            maxHeight="400px"
          />
        </Col>
        <Col xl={4} lg={6} md={12}>
          <ChallengesList 
            challenges={getActiveChallenges(10)}
            title="Recent Challenges"
            showHeader={true}
            maxHeight="400px"
          />
        </Col>
        <Col xl={4} lg={12} md={12}>
          <PostsList 
            posts={getRecentPosts(10)}
            title="Recent Posts"
            showHeader={true}
            maxHeight="400px"
          />
        </Col>
      </Row>

      <Footer />
    </>
  )
}

export default page

import Footer from '@/components/layout/Footer'
import ExtendedCards from './components/ExtendedCards'

import RecentChallengers from './components/RecentChallengers'
import PostsList from './components/PostsList'
// import InteractionsChart from './components/InteractionsChart'
import ChallengesChart from './components/ChallengesChart'
import PostsChart from './components/PostsChart'
import PageTitle from '@/components/PageTitle'
import { Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { getExtendedCardsData } from './mockData'
import { CampaignContentsService, PostData } from '@/services/campaignContentsService'
import ChallengerService from '@/services/challengerService'
import { Challenger } from '@/types/challenger'
import { useState, useEffect } from 'react'

const page = () => {
  const navigate = useNavigate()
  const extendedCardsData = getExtendedCardsData()
  const [campaignPosts, setCampaignPosts] = useState<PostData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Challengers state
  const [challengers, setChallengers] = useState<Challenger[]>([])
  const [challengersLoading, setChallengersLoading] = useState(true)
  const [challengersError, setChallengersError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampaignContents = async () => {
      try {
        setIsLoading(true)
        const response = await CampaignContentsService.getCampaignContents('daawatbiryani', 1, 10)
        if (response.success && response.data.posts) {
          setCampaignPosts(response.data.posts)
        }
      } catch (err) {
        setError('Failed to fetch campaign contents')
        console.error('Error fetching campaign contents:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaignContents()
  }, [])

  // Fetch challengers on component mount
  useEffect(() => {
    const fetchChallengers = async () => {
      try {
        setChallengersLoading(true)
        setChallengersError(null)
        const response = await ChallengerService.getAllChallengers({ 
          limit: 10,
          page: 1 
        })
        if (response.data) {
          setChallengers(response.data)
        }
      } catch (err) {
        setChallengersError('Failed to fetch challengers')
        console.error('Error fetching challengers:', err)
      } finally {
        setChallengersLoading(false)
      }
    }

    fetchChallengers()
  }, [])

  const handleCardClick = (_: number, cardData: any) => {
    switch (cardData.title) {
      // case 'Recent Interactions':
      //   navigate('/interactions')
      //   break
      case 'Challenges Taken':
        navigate('/challengers')
        break
      case 'Total Posts':
        navigate('/posts')
        break
      case 'Completed Challenges':
        navigate('/challengers')
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
        {/* <Col xl={4} lg={6} md={12}>
          <InteractionsChart />
        </Col> */}
        <Col xl={6} lg={6} md={12}>
          <ChallengesChart />
        </Col>
        <Col xl={6} lg={12} md={12}>
          <PostsChart />
        </Col>
      </Row>

      {/* Lists Section */}
      <Row className="mb-4 g-3">
        <Col xl={6} lg={6} md={12}>
          <RecentChallengers 
            challengers={challengers}
            title="Recent Challengers"
            showHeader={true}
            maxHeight="400px"
            isLoading={challengersLoading}
            error={challengersError}
            onTitleClick={() => window.open('/challengers', '_blank')}

          />
        </Col>
        {/* <Col xl={4} lg={6} md={12}>
          <ChallengesList 
            challenges={getActiveChallenges(10)}
            title="Recent Challenges"
            showHeader={true}
            maxHeight="400px"
          />
        </Col> */}
        <Col xl={6} lg={12} md={12}>
          <PostsList 
            posts={campaignPosts}
            title="Recent Posts"
            showHeader={true}
            maxHeight="400px"
            isLoading={isLoading}
            error={error}
            onTitleClick={() => window.open('/social/hashtag-performance', '_blank')}
          />
        </Col>
      </Row>

      <Footer />
    </>
  )
}

export default page

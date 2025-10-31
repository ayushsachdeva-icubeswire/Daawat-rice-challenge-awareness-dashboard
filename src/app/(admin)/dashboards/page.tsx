import Footer from '@/components/layout/Footer'
// import ExtendedCards from './components/ExtendedCards'

import RecentChallengers from './components/RecentChallengers'
import PostsList from './components/PostsList'
// import InteractionsChart from './components/InteractionsChart'
import ChallengesChart from './components/ChallengesChart'
import PostsChart from './components/PostsChart'
import PageTitle from '@/components/PageTitle'
import AnimatedFlipCounter from '@/components/AnimatedFlipCounter'
import { Row, Col } from 'react-bootstrap'
// import { useNavigate } from 'react-router-dom'
// import { getExtendedCardsData } from './mockData'
import { CampaignContentsService, PostData } from '@/services/campaignContentsService'
import ChallengerService from '@/services/challengerService'
import DashboardService, { DashboardStats } from '@/services/dashboardService'
// ProgressService is now used directly in AnimatedFlipCounter
import { Challenger } from '@/types/challenger'
import { useState, useEffect } from 'react'

const page = () => {
  // const navigate = useNavigate()
  // const extendedCardsData = getExtendedCardsData()
  const [campaignPosts, setCampaignPosts] = useState<PostData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentHashtag] = useState('all')
  const staticHashtags = [
    { value: 'all', label: 'All Hashtags', display: 'All Hashtags' },
    { value: 'onlydaawatnovember', label: '#onlydaawatnovember', display: '#onlydaawatnovember' },
    { value: 'onlyricenovember', label: '#onlyricenovember', display: '#onlyricenovember' },
    { value: 'riceyourawareness', label: '#riceyourawareness', display: '#riceyourawareness' }
  ]
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState<string | null>(null)
  
  // Challengers state
  const [challengers, setChallengers] = useState<Challenger[]>([])
  const [challengersLoading, setChallengersLoading] = useState(true)
  const [challengersError, setChallengersError] = useState<string | null>(null)

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardLoading(true)
        setDashboardError(null)
        const response = await DashboardService.getDashboardData()
        
        // Response is direct dashboard stats
        setDashboardData(response)
      } catch (err) {
        setDashboardError('Failed to fetch dashboard data')
        console.error('Error fetching dashboard data:', err)
      } finally {
        setDashboardLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  useEffect(() => {
    const fetchCampaignContents = async () => {
      try {
        setIsLoading(true)
        let hashtagParam = currentHashtag
        let hashtagParamsArr: string[] = []
        if (currentHashtag === 'all') {
          hashtagParamsArr = staticHashtags.filter(h => h.value !== 'all').map(h => h.value)
        }
        let response
        if (currentHashtag === 'all') {
          response = await CampaignContentsService.getMultipleHashtagsPerformance(hashtagParamsArr, 1, 10)
        } else {
          response = await CampaignContentsService.getCampaignContents(hashtagParam, 1, 10)
        }
        if (response.success && response.data.posts) {
          setCampaignPosts(response.data.posts)
        } else {
          setCampaignPosts([])
        }
      } catch (err) {
        setError('Failed to fetch campaign contents')
        console.error('Error fetching campaign contents:', err)
        setCampaignPosts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchCampaignContents()
  }, [currentHashtag])

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

  // Progress data is now handled by AnimatedFlipCounter components

  // const handleCardClick = (_: number, cardData: any) => {
  //   switch (cardData.title) {
  //     // case 'Recent Interactions':
  //     //   navigate('/interactions')
  //     //   break
  //     case 'Challenges Taken':
  //       navigate('/challengers')
  //       break
  //     case 'Total Posts':
  //       navigate('/posts')
  //       break
  //     case 'Completed Challenges':
  //       navigate('/challengers')
  //       break
  //     default:
  //       console.log('Card clicked:', cardData.title)
  //   }
  // }

  return (
    <>
      <PageTitle subName="Daawat" title="Dashboard Analytics" />
      
      {/* Animated Flip Counters */}
      <Row className="mb-4">
        <Col xl={6} lg={6} md={12}>
          <AnimatedFlipCounter 
            progressType="challengerProgress"
            label="Challenges Taken"
            className="h-100"
            animationDuration={5000}
            pollInterval={15000}
          />
        </Col>
        <Col xl={6} lg={6} md={12}>
          <AnimatedFlipCounter 
            progressType="erProgress"
            label="Interactions (Hashtags + Stories)"
            className="h-100"
            animationDuration={5000}
            pollInterval={15000}
          />
        </Col>
      </Row>
      
      {/* Counter Cards */}
      <div className="mb-4">
        {/* <ExtendedCards 
          cardsData={extendedCardsData}
          onCardClick={handleCardClick}
        /> */}
      </div>

      {/* Charts Section */}
      <Row className="mb-4 g-3">
        {/* <Col xl={4} lg={6} md={12}>
          <InteractionsChart />
        </Col> */}
        <Col xl={6} lg={6} md={12}>
          <ChallengesChart 
            challengrsGraphData={dashboardData?.challengrsGraphData || []}
            isLoading={dashboardLoading}
            error={dashboardError}
          />
        </Col>
        <Col xl={6} lg={12} md={12}>
          <PostsChart 
            postGraphData={Array.isArray(dashboardData?.postGraphData) ? dashboardData.postGraphData : []}
            isLoading={dashboardLoading}
            error={dashboardError}
          />
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
            challengrsGraphData={dashboardData?.challengrsGraphData || []}
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
          {/* <div className="mb-3 d-flex align-items-center gap-3">
            <label htmlFor="dashboardHashtagFilter" className="form-label fw-semibold mb-0">
              <i className="fas fa-hashtag text-primary me-2"></i>
              Filter Hashtag:
            </label>
            <select
              id="dashboardHashtagFilter"
              className="form-select"
              style={{ maxWidth: '250px' }}
              value={currentHashtag}
              onChange={e => setCurrentHashtag(e.target.value)}
            >
              {staticHashtags.map(hashtag => (
                <option key={hashtag.value} value={hashtag.value}>
                  {hashtag.display}
                </option>
              ))}
            </select>
          </div> */}
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

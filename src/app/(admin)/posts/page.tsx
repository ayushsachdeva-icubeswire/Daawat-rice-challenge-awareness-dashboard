import { useState, useMemo } from 'react'
import { Card, CardBody, CardHeader, Row, Col, Button, Badge, Form, InputGroup } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import Footer from '@/components/layout/Footer'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { mockPosts } from '@/app/(admin)/dashboards/mockData'
import { Post } from '@/types/dashboard'

// Simple time formatter
const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }
}

const PostsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [sortField, setSortField] = useState<keyof Post>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Generate more mock data for demonstration
  const extendedMockPosts = useMemo(() => {
    const basePosts = [...mockPosts]
    const additionalPosts = []
    
    const titles = [
      'Day 3: Perfect Basmati Rice Technique', 'Saffron Rice Instagram Tutorial', 'Brown Rice Bowl Transformation',
      'Traditional Biryani Secrets', 'One-Pot Rice Meal Magic', 'Coconut Rice Paradise Recipe',
      'Spicy Tomato Rice Challenge', 'Healthy Quinoa Rice Blend', 'Street Food Rice Delights',
      'Rice Pudding Dessert Goals', '15-Min Rice Meal Prep', 'Regional Rice Specialties'
    ]
    
    const categories = ['Biryani', 'Street Food', 'Healthy', 'Desserts', 'Regional', 'Quick Meals', 'Fusion']
    const authors = [
      { id: '1', name: 'Priya Sharma', avatar: '/src/assets/images/users/avatar-1.jpg' },
      { id: '2', name: 'Rahul Khanna', avatar: '/src/assets/images/users/avatar-2.jpg' },
      { id: '3', name: 'Meera Patel', avatar: '/src/assets/images/users/avatar-3.jpg' },
      { id: '4', name: 'Arjun Singh', avatar: '/src/assets/images/users/avatar-4.jpg' },
      { id: '5', name: 'Kavya Reddy', avatar: '/src/assets/images/users/avatar-5.jpg' },
      { id: '6', name: 'Rohit Gupta', avatar: '/src/assets/images/users/avatar-6.jpg' },
      { id: '7', name: 'Sneha Joshi', avatar: '/src/assets/images/users/avatar-7.jpg' },
      { id: '8', name: 'Vikram Menon', avatar: '/src/assets/images/users/avatar-8.jpg' },
    ]
    
    for (let i = 0; i < 35; i++) {
      const author = authors[Math.floor(Math.random() * authors.length)]
      const category = categories[Math.floor(Math.random() * categories.length)]
      const isPublished = Math.random() > 0.3
      
      additionalPosts.push({
        id: `post-${i + 6}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        content: `Join me in this amazing ${category.toLowerCase()} rice journey! 🍚 This post covers step-by-step instructions, tips from my grandmother, and the perfect Instagram shots for your rice challenge.`,
        author,
        category,
        tags: [category.toLowerCase(), '30dayschallenge', 'riceeating', 'instagramfood'].slice(0, Math.floor(Math.random() * 4) + 1),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 30),
        views: Math.floor(Math.random() * 500) + 50,
        isPublished,
      })
    }
    
    return [...basePosts, ...additionalPosts]
  }, [])

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(extendedMockPosts.map(post => post.category)))
    return uniqueCategories.sort()
  }, [extendedMockPosts])

  // Filter and search logic
  const filteredPosts = useMemo(() => {
    return extendedMockPosts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = filterCategory === 'all' || post.category === filterCategory
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'published' && post.isPublished) ||
        (filterStatus === 'draft' && !post.isPublished)
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [extendedMockPosts, searchTerm, filterCategory, filterStatus])

  // Sort logic
  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = aValue ? new Date(aValue as Date).getTime() : 0
        bValue = bValue ? new Date(bValue as Date).getTime() : 0
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (aValue == null) aValue = typeof a[sortField] === 'number' ? 0 : ''
      if (bValue == null) bValue = typeof b[sortField] === 'number' ? 0 : ''
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredPosts, sortField, sortDirection])

  // Pagination logic
  const totalPages = Math.ceil(sortedPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPosts = sortedPosts.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: keyof Post) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'react': return '#61dafb'
      case 'css': return '#1572b6'
      case 'javascript': return '#f7df1e'
      case 'node.js': return '#8cc84b'
      case 'typescript': return '#3178c6'
      case 'design': return '#ff6b6b'
      case 'devops': return '#326ce5'
      default: return '#8b5cf6'
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    pages.push(
      <Button
        key="prev"
        variant="outline-primary"
        size="sm"
        className="me-2"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <IconifyIcon icon="solar:alt-arrow-left-broken" />
      </Button>
    )

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? 'primary' : 'outline-primary'}
          size="sm"
          className="me-2"
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      )
    }

    pages.push(
      <Button
        key="next"
        variant="outline-primary"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <IconifyIcon icon="solar:alt-arrow-right-broken" />
      </Button>
    )

    return pages
  }

  return (
    <>
      <PageTitle subName="Daawat" title="Posts" />
      
      <Card>
        <CardHeader>
          <Row className="align-items-center">
            <Col>
              <h5 className="card-title mb-0">All Posts</h5>
              <small className="text-muted">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedPosts.length)} of {sortedPosts.length} posts
              </small>
            </Col>
            <Col xs="auto">
              <Badge bg="primary" pill>{sortedPosts.length}</Badge>
            </Col>
          </Row>
        </CardHeader>
        
        <CardBody>
          {/* Filters and Search */}
          <Row className="mb-4">
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <IconifyIcon icon="solar:magnifer-broken" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Data Table */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th 
                    scope="col" 
                    className="cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    Post {sortField === 'title' && (
                      <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                    )}
                  </th>
                  <th scope="col">Author</th>
                  <th 
                    scope="col"
                    className="cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    Category {sortField === 'category' && (
                      <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                    )}
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col">Engagement</th>
                  <th 
                    scope="col"
                    className="cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created {sortField === 'createdAt' && (
                      <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((post) => (
                  <tr key={post.id}>
                    <td style={{ maxWidth: '300px' }}>
                      <div>
                        <h6 className="mb-1">{post.title}</h6>
                        <p className="text-muted mb-1 small">
                          {truncateText(post.content, 80)}
                        </p>
                        <div>
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} bg="light" text="dark" className="me-1 small">
                              #{tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-muted small">+{post.tags.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="avatar-xs rounded-circle me-2"
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundImage: `url(${post.author.avatar})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        <span className="small">{post.author.name}</span>
                      </div>
                    </td>
                    <td>
                      <Badge 
                        style={{ 
                          backgroundColor: `${getCategoryColor(post.category)}20`, 
                          color: getCategoryColor(post.category),
                          border: `1px solid ${getCategoryColor(post.category)}30`
                        }}
                      >
                        {post.category}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={post.isPublished ? 'success' : 'warning'}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center me-3">
                          <IconifyIcon icon="solar:heart-broken" className="fs-12 me-1 text-danger" />
                          <span className="small">{post.likes}</span>
                        </div>
                        <div className="d-flex align-items-center me-3">
                          <IconifyIcon icon="solar:chat-round-line-broken" className="fs-12 me-1 text-primary" />
                          <span className="small">{post.comments}</span>
                        </div>
                        <div className="d-flex align-items-center me-3">
                          <IconifyIcon icon="solar:eye-broken" className="fs-12 me-1 text-muted" />
                          <span className="small">{post.views}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted small">
                      {formatTimeAgo(post.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Row className="mt-4">
              <Col className="d-flex justify-content-center">
                <div className="d-flex align-items-center">
                  {renderPagination()}
                </div>
              </Col>
            </Row>
          )}

          {paginatedPosts.length === 0 && (
            <div className="text-center py-5">
              <IconifyIcon icon="solar:document-text-broken" className="fs-48 text-muted mb-3" />
              <h5 className="text-muted">No posts found</h5>
              <p className="text-muted">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default PostsPage
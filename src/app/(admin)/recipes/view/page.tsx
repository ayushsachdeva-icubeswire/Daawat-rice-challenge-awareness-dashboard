import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState } from 'react'

const RecipeViewPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  // Mock rice recipes data from 30-day challenge
  const recipesData = [
    {
      id: 1,
      title: 'Hyderabadi Dum Biryani',
      category: 'Biryani',
      difficulty: 'Hard',
      cookTime: 120,
      servings: 6,
      rating: 4.9,
      reviews: 2456,
      author: 'Priya Sharma',
      mobile: '+91-9876543210',
      created: '2024-10-01',
      image: '/images/recipes/hyderabadi-biryani.jpg',
      ingredients: 18,
      status: 'Published'
    },
    {
      id: 2,
      title: 'South Indian Coconut Rice',
      category: 'Regional',
      difficulty: 'Easy',
      cookTime: 25,
      servings: 4,
      rating: 4.7,
      reviews: 1876,
      author: 'Meera Patel',
      mobile: '+91-9876543212',
      created: '2024-09-28',
      image: '/images/recipes/coconut-rice.jpg',
      ingredients: 10,
      status: 'Published'
    },
    {
      id: 3,
      title: 'Bengali Kheer (Rice Pudding)',
      category: 'Desserts',
      difficulty: 'Easy',
      cookTime: 35,
      servings: 6,
      rating: 4.8,
      reviews: 3456,
      author: 'Sneha Joshi',
      mobile: '+91-9876543216',
      created: '2024-10-05',
      image: '/images/recipes/rice-kheer.jpg',
      ingredients: 6,
      status: 'Published'
    },
    {
      id: 4,
      title: 'Mumbai Street Veg Fried Rice',
      category: 'Street Food',
      difficulty: 'Medium',
      cookTime: 20,
      servings: 3,
      rating: 4.6,
      reviews: 1342,
      author: 'Rahul Khanna',
      mobile: '+91-9876543211',
      created: '2024-09-30',
      image: '/images/recipes/fried-rice.jpg',
      ingredients: 12,
      status: 'Published'
    },
    {
      id: 5,
      title: 'Healthy Brown Rice Bowl',
      category: 'Healthy',
      difficulty: 'Easy',
      cookTime: 30,
      servings: 2,
      rating: 4.5,
      reviews: 987,
      author: 'Kavya Reddy',
      mobile: '+91-9876543214',
      created: '2024-10-03',
      image: '/images/recipes/brown-rice-bowl.jpg',
      ingredients: 14,
      status: 'Published'
    },
    {
      id: 6,
      title: 'Kashmiri Yakhni Pulao',
      category: 'Regional',
      difficulty: 'Hard',
      cookTime: 90,
      servings: 8,
      rating: 4.9,
      reviews: 2145,
      author: 'Rohit Gupta',
      mobile: '+91-9876543215',
      created: '2024-09-25',
      image: '/images/recipes/yakhni-pulao.jpg',
      ingredients: 16,
      status: 'Published'
    },
    {
      id: 7,
      title: '15-Minute Lemon Rice',
      category: 'Quick Meals',
      difficulty: 'Easy',
      cookTime: 15,
      servings: 3,
      rating: 4.4,
      reviews: 756,
      author: 'Vikram Menon',
      mobile: '+91-9876543217',
      created: '2024-10-02',
      image: '/images/recipes/lemon-rice.jpg',
      ingredients: 8,
      status: 'Published'
    },
    {
      id: 8,
      title: 'Fusion Mexican Rice Bowl',
      category: 'Fusion',
      difficulty: 'Medium',
      cookTime: 35,
      servings: 4,
      rating: 4.6,
      reviews: 1234,
      author: 'Arjun Singh',
      mobile: '+91-9876543213',
      created: '2024-09-29',
      image: '/images/recipes/mexican-rice-bowl.jpg',
      ingredients: 15,
      status: 'Draft'
    },
  ]

  const filteredRecipes = recipesData.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const totalRecipes = recipesData.length
  const publishedRecipes = recipesData.filter(recipe => recipe.status === 'Published').length
  const averageRating = recipesData.reduce((sum, recipe) => sum + recipe.rating, 0) / recipesData.length
  const totalReviews = recipesData.reduce((sum, recipe) => sum + recipe.reviews, 0)

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success'
      case 'Medium': return 'bg-warning'
      case 'Hard': return 'bg-danger'
      default: return 'bg-secondary'
    }
  }

  return (
    <>
      <PageTitle title="Recipe View" subName="Browse and manage your recipe collection" />
      
      <div className="container-fluid">
        {/* Overview Cards */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{totalRecipes}</h4>
                    <p className="mb-0">Total Recipes</p>
                  </div>
                  <i className="fas fa-utensils fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{publishedRecipes}</h4>
                    <p className="mb-0">Published</p>
                  </div>
                  <i className="fas fa-check-circle fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{averageRating.toFixed(1)}</h4>
                    <p className="mb-0">Avg Rating</p>
                  </div>
                  <i className="fas fa-star fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{totalReviews.toLocaleString()}</h4>
                    <p className="mb-0">Total Reviews</p>
                  </div>
                  <i className="fas fa-comments fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipes Management */}
        <ComponentContainerCard
          id="recipes-view"
          title="Recipe Collection"
          description="Browse and manage your recipe database"
        >
          <div className="row mb-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Biryani">Biryani</option>
                <option value="Regional">Regional</option>
                <option value="Desserts">Desserts</option>
                <option value="Street Food">Street Food</option>
                <option value="Healthy">Healthy</option>
                <option value="Quick Meals">Quick Meals</option>
                <option value="Fusion">Fusion</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="col-md-3 text-end">
              <button className="btn btn-primary me-2">
                <i className="fas fa-plus me-2"></i>Add Recipe
              </button>
              <button className="btn btn-outline-primary">
                <i className="fas fa-download me-2"></i>Export
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Recipe</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Cook Time</th>
                  <th>Servings</th>
                  <th>Rating</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecipes.map((recipe) => (
                  <tr key={recipe.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <div 
                            className="bg-light rounded"
                            style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <i className="fas fa-image text-muted"></i>
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-semibold">{recipe.title}</h6>
                          <small className="text-muted">{recipe.ingredients} ingredients</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{recipe.category}</span>
                    </td>
                    <td>
                      <span className={`badge ${getDifficultyBadgeColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                    </td>
                    <td>{recipe.cookTime} min</td>
                    <td>{recipe.servings} people</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-star text-warning me-1"></i>
                        <span className="fw-semibold">{recipe.rating}</span>
                        <small className="text-muted ms-1">({recipe.reviews})</small>
                      </div>
                    </td>
                    <td>{recipe.author}</td>
                    <td>
                      <span className={`badge ${recipe.status === 'Published' ? 'bg-success' : 'bg-secondary'}`}>
                        {recipe.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button className="btn btn-sm btn-outline-primary" title="View Recipe">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-warning" title="Edit Recipe">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-success" title="Duplicate">
                          <i className="fas fa-copy"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" title="Delete">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-4">
              <i className="fas fa-utensils fa-3x text-muted mb-3"></i>
              <p className="text-muted">No recipes found matching your criteria.</p>
              <button className="btn btn-primary">
                <i className="fas fa-plus me-2"></i>Create Your First Recipe
              </button>
            </div>
          )}
        </ComponentContainerCard>
      </div>
    </>
  )
}

export default RecipeViewPage
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState } from 'react'

const DietPlanPage = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Mock rice-based diet plan data for 30-day challenge
  const dietPlans = [
    {
      id: 1,
      name: '30-Day Rice Challenge Diet',
      duration: '30 days',
      calories: '1800 cal/day',
      meals: 4,
      difficulty: 'Intermediate',
      created: '2024-10-01',
      status: 'Active',
      riceType: 'Mixed Varieties',
      participants: 156
    },
    {
      id: 2,
      name: 'Biryani Lover\'s Plan',
      duration: '30 days',
      calories: '2200 cal/day',
      meals: 3,
      difficulty: 'Advanced',
      created: '2024-10-05',
      status: 'Active',
      riceType: 'Basmati Focus',
      participants: 89
    },
    {
      id: 3,
      name: 'Healthy Brown Rice Journey',
      duration: '30 days',
      calories: '1600 cal/day',
      meals: 5,
      difficulty: 'Beginner',
      created: '2024-09-28',
      status: 'Active',
      riceType: 'Brown Rice Only',
      participants: 203
    },
    {
      id: 4,
      name: 'South Indian Rice Special',
      duration: '30 days',
      calories: '1900 cal/day',
      meals: 4,
      difficulty: 'Intermediate',
      created: '2024-09-25',
      status: 'Draft',
      riceType: 'Regional Varieties',
      participants: 67
    },
    {
      id: 5,
      name: 'Quick Rice Meals Plan',
      duration: '30 days',
      calories: '1700 cal/day',
      meals: 6,
      difficulty: 'Beginner',
      created: '2024-09-30',
      status: 'Active',
      riceType: 'Fast Cooking',
      participants: 142
    },
  ]

  const filteredPlans = dietPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <PageTitle title="Diet Plan" subName="Manage and track diet plans" />
      
      <div className="container-fluid">
        <ComponentContainerCard
          id="diet-plan-container"
          title="Diet Plans Management"
          description="Manage and track all diet plans"
        >
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search diet plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6 text-end">
              <button className="btn btn-primary">
                <i className="fas fa-plus me-2"></i>Add New Plan
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Plan Name</th>
                  <th>Duration</th>
                  <th>Calories/Day</th>
                  <th>Meals</th>
                  <th>Difficulty</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="fw-semibold">{plan.name}</td>
                    <td>{plan.duration}</td>
                    <td>
                      <span className="badge bg-info">{plan.calories}</span>
                    </td>
                    <td>{plan.meals}</td>
                    <td>
                      <span className={`badge ${
                        plan.difficulty === 'Beginner' ? 'bg-success' :
                        plan.difficulty === 'Intermediate' ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {plan.difficulty}
                      </span>
                    </td>
                    <td>{new Date(plan.created).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${plan.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                        {plan.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-warning">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPlans.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No diet plans found matching your search.</p>
            </div>
          )}
        </ComponentContainerCard>
      </div>
    </>
  )
}

export default DietPlanPage
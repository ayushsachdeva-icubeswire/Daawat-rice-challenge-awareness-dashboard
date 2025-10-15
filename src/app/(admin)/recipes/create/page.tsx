import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState } from 'react'

const RecipeCreatePage = () => {
  const [recipeData, setRecipeData] = useState({
    title: '',
    category: '',
    difficulty: '',
    cookTime: '',
    prepTime: '',
    servings: '',
    description: '',
    status: 'draft'
  })

  const [ingredients, setIngredients] = useState([
    { id: 1, name: '', quantity: '', unit: '' }
  ])

  const [instructions, setInstructions] = useState([
    { id: 1, step: '', order: 1 }
  ])

  const handleInputChange = (field: string, value: string) => {
    setRecipeData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addIngredient = () => {
    const newId = Math.max(...ingredients.map(i => i.id)) + 1
    setIngredients([...ingredients, { id: newId, name: '', quantity: '', unit: '' }])
  }

  const removeIngredient = (id: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ingredient => ingredient.id !== id))
    }
  }

  const updateIngredient = (id: number, field: string, value: string) => {
    setIngredients(ingredients.map(ingredient => 
      ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
    ))
  }

  const addInstruction = () => {
    const newId = Math.max(...instructions.map(i => i.id)) + 1
    const newOrder = instructions.length + 1
    setInstructions([...instructions, { id: newId, step: '', order: newOrder }])
  }

  const removeInstruction = (id: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter(instruction => instruction.id !== id))
    }
  }

  const updateInstruction = (id: number, value: string) => {
    setInstructions(instructions.map(instruction => 
      instruction.id === id ? { ...instruction, step: value } : instruction
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here

  }

  return (
    <>
      <PageTitle title="Create Recipe" subName="Add a new recipe to your collection" />
      
      <div className="container-fluid">
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Basic Information */}
            <div className="col-lg-8">
              <ComponentContainerCard
                id="recipe-basic-info"
                title="Basic Information"
                description="Enter the basic details of your recipe"
              >
                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">Recipe Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={recipeData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter recipe title"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="category" className="form-label">Category *</label>
                      <select
                        className="form-select"
                        id="category"
                        value={recipeData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Biryani">Biryani</option>
                        <option value="Regional">Regional</option>
                        <option value="Street Food">Street Food</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Healthy">Healthy</option>
                        <option value="Quick Meals">Quick Meals</option>
                        <option value="Fusion">Fusion</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label htmlFor="difficulty" className="form-label">Difficulty *</label>
                      <select
                        className="form-select"
                        id="difficulty"
                        value={recipeData.difficulty}
                        onChange={(e) => handleInputChange('difficulty', e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label htmlFor="prepTime" className="form-label">Prep Time (min)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="prepTime"
                        value={recipeData.prepTime}
                        onChange={(e) => handleInputChange('prepTime', e.target.value)}
                        placeholder="15"
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label htmlFor="cookTime" className="form-label">Cook Time (min) *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="cookTime"
                        value={recipeData.cookTime}
                        onChange={(e) => handleInputChange('cookTime', e.target.value)}
                        placeholder="30"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label htmlFor="servings" className="form-label">Servings *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="servings"
                        value={recipeData.servings}
                        onChange={(e) => handleInputChange('servings', e.target.value)}
                        placeholder="4"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows={4}
                    value={recipeData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of your recipe..."
                  ></textarea>
                </div>
              </ComponentContainerCard>

              {/* Ingredients */}
              <ComponentContainerCard
                id="recipe-ingredients"
                title="Ingredients"
                description="List all ingredients required for this recipe"
              >
                {ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="row mb-3">
                    <div className="col-md-5">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ingredient name"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Quantity"
                        value={ingredient.quantity}
                        onChange={(e) => updateIngredient(ingredient.id, 'quantity', e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                      >
                        <option value="">Unit</option>
                        <option value="cup">Cup</option>
                        <option value="tbsp">Tablespoon</option>
                        <option value="tsp">Teaspoon</option>
                        <option value="gram">Gram</option>
                        <option value="kg">Kilogram</option>
                        <option value="ml">Milliliter</option>
                        <option value="liter">Liter</option>
                        <option value="piece">Piece</option>
                        <option value="pinch">Pinch</option>
                      </select>
                    </div>
                    <div className="col-md-1">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeIngredient(ingredient.id)}
                        disabled={ingredients.length === 1}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={addIngredient}
                >
                  <i className="fas fa-plus me-2"></i>Add Ingredient
                </button>
              </ComponentContainerCard>

              {/* Instructions */}
              <ComponentContainerCard
                id="recipe-instructions"
                title="Instructions"
                description="Step-by-step cooking instructions"
              >
                {instructions.map((instruction, index) => (
                  <div key={instruction.id} className="row mb-3">
                    <div className="col-md-1">
                      <div className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle" style={{ width: '40px', height: '40px' }}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="col-md-10">
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder={`Step ${index + 1} instructions...`}
                        value={instruction.step}
                        onChange={(e) => updateInstruction(instruction.id, e.target.value)}
                      ></textarea>
                    </div>
                    <div className="col-md-1">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeInstruction(instruction.id)}
                        disabled={instructions.length === 1}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={addInstruction}
                >
                  <i className="fas fa-plus me-2"></i>Add Step
                </button>
              </ComponentContainerCard>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Recipe Image */}
              <ComponentContainerCard
                id="recipe-image"
                title="Recipe Image"
                description="Upload an image for your recipe"
              >
                <div className="text-center">
                  <div 
                    className="border border-dashed rounded p-4 mb-3"
                    style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
                  >
                    <i className="fas fa-image fa-3x text-muted mb-3"></i>
                    <p className="text-muted mb-3">Click to upload recipe image</p>
                    <button type="button" className="btn btn-outline-primary">
                      <i className="fas fa-upload me-2"></i>Choose File
                    </button>
                  </div>
                  <small className="text-muted">Supported formats: JPG, PNG, GIF (Max: 5MB)</small>
                </div>
              </ComponentContainerCard>

              {/* Publish Settings */}
              <ComponentContainerCard
                id="recipe-publish"
                title="Publish Settings"
                description="Control how your recipe is published"
              >
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select
                    className="form-select"
                    id="status"
                    value={recipeData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="featured" />
                    <label className="form-check-label" htmlFor="featured">
                      Featured Recipe
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="allowComments" defaultChecked />
                    <label className="form-check-label" htmlFor="allowComments">
                      Allow Comments
                    </label>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-2"></i>Save Recipe
                  </button>
                  <button type="button" className="btn btn-outline-secondary">
                    <i className="fas fa-eye me-2"></i>Preview
                  </button>
                </div>
              </ComponentContainerCard>

              {/* Recipe Tips */}
              <ComponentContainerCard
                id="recipe-tips"
                title="Recipe Tips"
                description="Guidelines for creating great recipes"
              >
                <div className="small">
                  <div className="mb-2">
                    <i className="fas fa-lightbulb text-warning me-2"></i>
                    Use clear, descriptive titles
                  </div>
                  <div className="mb-2">
                    <i className="fas fa-lightbulb text-warning me-2"></i>
                    Be specific with measurements
                  </div>
                  <div className="mb-2">
                    <i className="fas fa-lightbulb text-warning me-2"></i>
                    Include prep and cook times
                  </div>
                  <div className="mb-2">
                    <i className="fas fa-lightbulb text-warning me-2"></i>
                    Add cooking tips and variations
                  </div>
                  <div>
                    <i className="fas fa-lightbulb text-warning me-2"></i>
                    Use high-quality images
                  </div>
                </div>
              </ComponentContainerCard>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default RecipeCreatePage
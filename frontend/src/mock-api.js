// Simple mock API for local development testing
import citiesData from '../../cities_data.json'

export const mockAPI = {
  question: () => {
    const cities = citiesData
    const city = cities[Math.floor(Math.random() * cities.length)]
    const correctState = city.state
    
    // Get all unique states
    const allStates = [...new Set(cities.map(c => c.state))]
    
    // Create choices (correct + 3 random incorrect)
    const incorrectStates = allStates.filter(s => s !== correctState)
    const selectedIncorrect = incorrectStates
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    
    const choices = [correctState, ...selectedIncorrect]
      .sort(() => Math.random() - 0.5)
    
    return {
      city: city.name,
      county: city.county,
      choices: choices,
      correct_answer: correctState
    }
  },
  
  stats: () => ({
    total_cities: citiesData.length,
    total_states: new Set(citiesData.map(c => c.state)).size
  })
}
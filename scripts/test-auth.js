// Test if authentication is working for API calls
async function testAuth() {
  try {
    console.log('🔐 Testing authentication...')
    
    // Test getting power system todos
    const response = await fetch('/api/power-system')
    console.log('API Response status:', response.status)
    
    if (response.status === 401) {
      console.log('❌ Authentication failed - user not logged in')
      return false
    }
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Authentication successful, todos:', data.powerSystemTodos?.length || 0)
      return true
    } else {
      console.log('❌ API call failed with status:', response.status)
      const errorText = await response.text()
      console.log('Error:', errorText)
      return false
    }
  } catch (error) {
    console.error('❌ Network error:', error)
    return false
  }
}

// Test edit API call
async function testEdit(todoId, newTitle) {
  try {
    console.log('🔧 Testing edit API...')
    
    const response = await fetch(`/api/power-system/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTitle
      })
    })
    
    console.log('Edit API Response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Edit successful:', data)
      return true
    } else {
      console.log('❌ Edit failed with status:', response.status)
      const errorText = await response.text()
      console.log('Error:', errorText)
      return false
    }
  } catch (error) {
    console.error('❌ Edit network error:', error)
    return false
  }
}

// Auto-run tests
console.log('🧪 Running authentication tests...')
testAuth().then(authSuccess => {
  if (authSuccess) {
    console.log('Ready to test edit/delete functionality')
    console.log('Call testEdit(todoId, newTitle) to test editing')
  } else {
    console.log('Authentication must be set up first')
  }
})

// Make functions available globally
window.testAuth = testAuth
window.testEdit = testEdit

// Check if Power System functionality is working
console.log('🔍 Power System Debug Script Loaded')

// Function to test edit mode toggle
function testEditMode() {
  console.log('Testing Edit Goals button...')
  const editButton = document.querySelector('button:has(svg)')
  if (editButton) {
    console.log('Found edit button, clicking...')
    editButton.click()
  } else {
    console.log('Edit button not found')
  }
}

// Function to check if edit/delete buttons are visible
function checkEditDeleteButtons() {
  const editButtons = document.querySelectorAll('[title="Edit"]')
  const deleteButtons = document.querySelectorAll('[title="Delete"]')
  
  console.log(`Found ${editButtons.length} edit buttons`)
  console.log(`Found ${deleteButtons.length} delete buttons`)
  
  if (editButtons.length > 0) {
    console.log('Testing first edit button...')
    editButtons[0].click()
  }
}

// Run tests after a delay to let the page load
setTimeout(() => {
  console.log('🧪 Running Power System tests...')
  testEditMode()
  setTimeout(checkEditDeleteButtons, 1000)
}, 2000)

console.log('Copy and paste these functions in browser console to test:')
console.log('testEditMode() - Tests the Edit Goals button')
console.log('checkEditDeleteButtons() - Checks for edit/delete buttons')

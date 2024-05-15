export function formatDate(timestamp) {
  const date = new Date(parseInt(timestamp))

  const options = { day: '2-digit', month: 'short', year: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

// Example
// const timestamp = 1626259200000
// console.log(formatDate(timestamp)) // Output: Jul 14, 2021

const readline = require('readline');
const axios = require('axios');

// Retrieve command-line arguments
const args = process.argv.slice(2);

// Check if API URL is provided as a command-line argument
if (args.length === 0) {
  console.error('Please provide a URL');
  process.exit(1); // Exit with an error code
}

// Extract the API URL from the command-line arguments
const apiUrl = args[0]; // The API URL is the first command-line argument

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the user ID to retrieve: ', async (userId) => {
  try {
    // Send an HTTP GET request to the provided API URL with the user ID
    const response = await axios.get(`${apiUrl}/users/${userId}`);

    if (response.status === 200) {
      // If the request is successful (status code 200), display the user record
      console.log('User record:');
      console.log(response.data);
    } else if (response.status === 404) {
      // If the user is not found (status code 404), inform the user
      console.log('User not found.');
    } else {
      // Handle other error cases
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('User not found.');
    } else {
      console.error(`Error: ${error.message}`);
    }
  }

  rl.close();
});

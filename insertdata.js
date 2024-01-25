// Importing required modules
require('@twentyfourg/cloud-sdk').logger(); // Importing a logger from a module
const axios = require('axios'); // Importing Axios for making HTTP requests

// User data to be created
const USER_CREATE = [
  { firstName: 'Will', lastName: 'Smith' },
  { firstName: 'Johnny', lastName: 'Depp' },
  { firstName: 'Kate', lastName: 'Perry' },
  { firstName: 'Tommy', lastName: 'Glare' }
];

// Retrieve command-line arguments
const args = process.argv.slice(2);

// Check if API URL is provided as a command-line argument
if (args.length === 0) {
  console.error('Please provide a URL');
  process.exit();
}

// Extract the API URL from the command-line arguments
const [API_URL] = args.slice(-1);

// User object with a create function to create users
const user = {
  // Asynchronous function to create users using the provided userRecords
  create: async (userRecords) => {
    const createdIds = []; // Array to store the IDs of created users
    // Loop through each userRecord and send a POST request to create the user
    for (const userRecord of userRecords) {
      try {
        const { data } = await axios({
          method: 'post',
          url: `${API_URL}/users`,
          data: userRecord,
        });
        // Check if the response contains an "id" and log success or error accordingly
        if (data.id) {
          createdIds.push(data.id);
          console.log('Create user success');
        } else {
          console.error('No "id" in response');
        }
      } catch (error) {
        // Log any errors that occur during user creation
        console.error(`Create user failed: ${error.message}`);
      }
    }
    return createdIds; // Return the IDs of the created users
  },
};

// Immediately Invoked Function Expression 
(async () => {
  try {
    // Call the create function to create users and obtain their IDs
    const ids = await user.create(USER_CREATE);
    console.log('Created User IDs:', ids); // Log the IDs of the created users
  } catch (error) {
    console.error(error.message); // Log any errors that occur during the process
  }
})();

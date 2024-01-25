require('@twentyfourg/cloud-sdk').logger();
const axios = require('axios');
const readline = require('readline');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Please provide a URL');
  process.exit();
}
const [API_URL] = args.slice(-1);

const user = {
  delete: async (id) => {
    try {
      const { status } = await axios({
        method: 'delete',
        url: `${API_URL}/users/${id}`,
      });
      if (status === 204) {
        console.log('Delete user success');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error(`Delete user failed with status:  ${error.response.status}`);
        console.error(`id:${id} not found in the database to perform a deletion`);
      } else {
        console.error(`Delete user failed: ${error.message}`);
      }
    }
  },
};



const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the user ID to delete: ', async (userIdToDelete) => {
  try {
    // Validate the user input if necessary
    await user.delete(userIdToDelete);
  } catch (error) {
    console.error(error.message);
  } finally {
    rl.close();
  }
});


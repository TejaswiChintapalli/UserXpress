const readline = require('readline');
const axios = require('axios');

require('@twentyfourg/cloud-sdk').logger();

const USER_PATCH = { firstName: 'Hollywood', lastName: 'Actor' };
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Please provide a URL');
  process.exit();
}

const [API_URL] = args.slice(-1);

const user = {
  patch: async (id, data) => {
    try {
      const { status } = await axios({
        method: 'patch',
        url: `${API_URL}/users/${id}`,
        data,
      });

      if (status === 204) {
        console.log('User updated successfully');
      } else {
        throw new Error(`User update failed with status code ${status}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('User not found');
      } else {
        throw new Error(`User update failed: ${error.message}`);
      }
    }
  },
};



const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the user ID to update: ', async (userId) => {
  try {
    await user.patch(userId, USER_PATCH);
  } catch (error) {
    console.error(error.message);
  } finally {
    rl.close();
  }
});


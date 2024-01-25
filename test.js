require('@twentyfourg/cloud-sdk').logger();
const axios = require('axios');

const USER_CREATE = { firstName: 'Test', lastName: 'User' };
const USER_PATCH = { firstName: '24G', lastName: 'Backend' };

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('please provide a url');
  process.exit();
}
const [API_URL] = args.slice(-1);

const user = {
  create: async () => {
    try {
      const { data } = await axios({ method: 'post', url: `${API_URL}/users`, data: USER_CREATE });
      if (!data.id) throw Error('no "id" in response');
      console.log('create user success');
      return data.id;
    } catch (error) {
      throw Error(`create user failed: ${error.message}`);
    }
  },
  get: async (id, obj) => {
    try {
      const { data } = await axios({ method: 'get', url: `${API_URL}/users/${id}` });
      const { firstName, lastName } = obj;
      if (data.id !== id) throw Error('"id" in response does not match');
      if (data.firstName !== firstName) throw Error('"firstName" in response does not match');
      if (data.lastName !== lastName) throw Error('"lastName" in response does not match');
      console.log(`get user success: ${JSON.stringify(data)}`);
      return data.id;
    } catch (error) {
      if (!obj) {
        if (error.response.status !== 404) throw Error('status code should be a 404');
        console.log('get user success');
      } else {
        throw Error(`get user failed: ${error.message}`);
      }
    }
  },
  patch: async (id, data) => {
    try {
      const { status } = await axios({
        method: 'patch',
        url: `${API_URL}/users/${id}`,
        data,
      });
      if (status !== 204) throw Error('status code should be a 204');
      console.log('patch user success');
    } catch (error) {
      throw Error(`patch user failed: ${error.message}`);
    }
  },
  delete: async (id, data) => {
    try {
      const { status } = await axios({
        method: 'delete',
        url: `${API_URL}/users/${id}`,
        data,
      });
      if (status !== 204) throw Error('status code should be a 204');
      console.log('delete user success');
    } catch (error) {
      throw Error(`delete user failed: ${error.message}`);
    }
  },
};

(async () => {
  try {
    const id = await user.create();
    await user.get(id, USER_CREATE);
    await user.patch(id, USER_PATCH);
    await user.get(id, USER_PATCH);
    await user.delete(id);
    await user.get(id);
  } catch (error) {
    console.error(error.message);
  }
})();

const axios = require('axios');

const CLIENT_ID = 'pp9FGxWx95UovdV2RKdDaU5DcqxIs862';
const CLIENT_SECRET = 'lpW83-l2Zb2Kw-5xQmBjCXEwP-cE0UlXw2CftocrgX6B_19RD33wPUG51_Z1_kMN';
const AUDIENCE = 'https://dev-sry1u1oubbjoil16.us.auth0.com/api/v2/';
const CONNECTION = 'Username-Password-Authentication';

const getApiToken = async () => {
  console.log('here');
  const response = await axios.post(
    'https://dev-sry1u1oubbjoil16.us.auth0.com/oauth/token',
    {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      audience: AUDIENCE,
      grant_type: 'client_credentials',
    },
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    },
  );
  console.log(response);
  return response.data.access_token;
};

const login = async (username, password) => {
  try {
    const response = await axios.post(
      'https://dev-sry1u1oubbjoil16.us.auth0.com/oauth/token',
      {
        grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
        username: username,
        password: password,
        scope: 'offline_access openid',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        audience: AUDIENCE,
        realm: CONNECTION,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-Encoding': 'application/json',
        },
      },
    );
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      idToken: response.data.id_token,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const register = async (username, password) => {
  try {
    const accessToken = await getApiToken();
    const response = await axios.post(
      'https://dev-sry1u1oubbjoil16.us.auth0.com/api/v2/users',
      {
        email: username,
        connection: CONNECTION,
        password: password,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Encoding': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const refresh = async (refreshToken) => {
  try {
    const response = await axios.post(
      'https://dev-sry1u1oubbjoil16.us.auth0.com/oauth/token',
      {
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
      },
      {
        headers: {
          'Accept-Encoding': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  login,
  register,
  refresh,
};

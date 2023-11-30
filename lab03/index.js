const request = require('request-promise');
let access_token;
let refresh_token;
const url = 'https://dev-sry1u1oubbjoil16.us.auth0.com';
const client_id = 'pp9FGxWx95UovdV2RKdDaU5DcqxIs862';
const client_secret = 'lpW83-l2Zb2Kw-5xQmBjCXEwP-cE0UlXw2CftocrgX6B_19RD33wPUG51_Z1_kMN';

const options = {
  method: 'POST',
  url: `${url}/oauth/token/`,
  headers: { 'content-type': 'application:/x-www-form-urlencoded' },
  form: {
    realm: 'Username-Password-Authentication',
    grant_type: 'password',
    username: '100dopamine@gmail.com',
    password: 'password#55',
    audience: `${url}/api/v2/`,
    client_id: client_id,
    client_secret: client_secret,
    scope: 'offline_access',
  },
};

const formRefreshOptions = (refresh_token) => {
  return {
    method: 'POST',
    url: `${url}/oauth/token`,
    headers: { 'content-type': 'application:/x-www-form-urlencoded' },
    form: {
      grant_type: 'refresh_token',
      client_id: client_id,
      client_secret: client_secret,
      refresh_token: refresh_token,
    },
  };
};

request(options, (err, res, body) => {
  if (err) throw new Error(err);
  refresh_token = JSON.parse(body).refresh_token;
  console.log(refresh_token);
}).then(() => {
  request(formRefreshOptions(refresh_token), (err, res, body) => {
    if (err) throw new Error(err);
    refresh_token = JSON.parse(body).refresh_token;
    console.log(body);
  });
  changePassword();
});

function changePassword() {
  const tokenOptions = {
    method: 'POST',
    url: `${url}/oauth/token`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
      client_id: 'pp9FGxWx95UovdV2RKdDaU5DcqxIs862',
      client_secret: 'lpW83-l2Zb2Kw-5xQmBjCXEwP-cE0UlXw2CftocrgX6B_19RD33wPUG51_Z1_kMN',
      audience: `${url}/api/v2/`,
      grant_type: 'client_credentials',
    },
  };

  const formPasswordOptions = (access_token) => {
    return {
      method: 'PATCH',
      url: `${url}/api/v2/users/auth0|abc1`,
      headers: {
        'content-type': 'x-www-form-urlencoded',
        Authorization: `Bearer ${access_token}`,
      },
      form: {
        password: 'password#55',
      },
    };
  };

  request(tokenOptions, (err, res, body) => {
    if (err) throw new Error(err);
    access_token = JSON.parse(body).access_token;
  }).then(() => {
    request(formPasswordOptions(access_token), (err, res, body) => {
      if (err) throw new Error(err);
      console.log(body);
      console.log('Password is changed!');
    });
  });
}

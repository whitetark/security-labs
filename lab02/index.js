const request = require('request-promise')
const url = 'https://dev-sry1u1oubbjoil16.us.auth0.com'
let token

const options = {
  method: 'POST',
  url: `${url}/oauth/token`,
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  form: {
    client_id: 'pp9FGxWx95UovdV2RKdDaU5DcqxIs862',
    client_secret: 'lpW83-l2Zb2Kw-5xQmBjCXEwP-cE0UlXw2CftocrgX6B_19RD33wPUG51_Z1_kMN',
    audience: `${url}/api/v2/`,
    grant_type: 'client_credentials',
  },
}

const formRequestOptions = (token) => {
  return (result = {
    method: 'POST',
    url: `${url}/api/v2/users`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: '100dopamine@gmail.com',
      user_metadata: {},
      blocked: false,
      email_verified: false,
      app_metadata: {},
      given_name: 'Sviatoslav',
      family_name: 'Chapcha',
      name: 'Sviat Chapcha',
      nickname: 'whitetark',
      picture:
        'https://secure.gravatar.com/avatar/15626c5e0c749cb912f9d1ad48dba440?s=480&r=pg&d=https%3A%2F%2Fssl.gstatic.com%2Fs2%2Fprofiles%2Fimages%2Fsilhouette80.png',
      user_id: 'abc1',
      connection: 'Username-Password-Authentication',
      password: 'Paccwrd#228',
      verify_email: false,
    }),
  })
}

request(options, (err, res, body) => {
  if (err) throw new Error(err)
  token = JSON.parse(body).access_token
}).then(() => {
  const newOptions = formRequestOptions(token)
  console.log(newOptions)
  request(newOptions, (err, res, body) => {
    if (err) throw new Error(err)
    console.log(body)
  })
})

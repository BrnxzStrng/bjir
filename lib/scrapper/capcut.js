async function capcutdl(Url) {
  try {
    let { request } = await axios.get(Url);
    let res = request.res.responseUrl;
    let token = res.match(/\d+/)[0];
    const { data } = await axios({
      url: `https://ssscap.net/api/download/${token}`,
      method: 'GET',
      headers: {
        'Cookie': 'sign=2cbe441f7f5f4bdb8e99907172f65a42; device-time=1685437999515'
      }
    });    
return data
  } catch (error) {
    console.log(error);
  }
}

import axios from 'axios';

export const getStaticLayersData = async () => {
  const response = await axios.get('/api/staticlayers');
  return response.data;
};

export const findPlace = async (searchedPlace, lat, lon) => {
  let query = `query=${searchedPlace}`;
  if (lon && lat) {
    // longitude and latitude to bias results for certain place
    query += `&lat=${lat}&lon=${lon}`;
  }
  const response = await axios.get(`/SEARCH?${query}`);
  if (response.status === 200) {
    const { results } = response.data;
    const resultData = results.map((item) => ({
      address: item.address,
      coordinates: [item.position.lon, item.position.lat],
    }));
    return resultData;
  }
  return [];
};
export const getAttributesData = async (searchParams, baseUrl = '/api/attributes?') => {
  const response = await axios.get(`${baseUrl}${searchParams}`);

  if (Object.keys(response.data).length === 0) {
    return [];
  }

  const responseLimit = (searchParams.get('limit') <= 100 ? searchParams.get('limit') : 100) || 100;
  let responseDataLength = 0;

  for (let i = 0; i < searchParams.getAll('attributeId').length; i++) {
    responseDataLength += response.data[searchParams.getAll('attributeId')[i]]
      ? response.data[searchParams.getAll('attributeId')[i]].length
      : 0;
  }
  let remainingCount = response.headers['x-total-count'] - responseDataLength;
  const finalResponse = [];
  finalResponse.push(response.data);
  const allPromises = [];
  let count = 1;
  const finalResponseProcessed = [{}];

  while (remainingCount > 0) {
    const newPromise = axios.get(`${baseUrl}${searchParams}&offset=${responseLimit * count}`);
    allPromises.push(newPromise);
    remainingCount -= responseLimit;
    count += 1;
  }

  await Promise.all(allPromises)
    .then((responses) => {
      responses.forEach((response) => finalResponse.push(response.data));
    })
    .catch(() => {
      return [];
    });

  finalResponse.forEach((obj) => {
    for (let i = 0; i < Object.keys(obj).length; i++) {
      const key = Object.keys(obj)[i];
      if (!(key in finalResponseProcessed[0])) {
        finalResponseProcessed[0][key] = [];
      }
    }
  });

  finalResponse.forEach((obj) => {
    for (let i = 0; i < Object.keys(obj).length; i++) {
      const key = Object.keys(obj)[i];
      finalResponseProcessed[0][key].push(obj[key]);
    }
  });

  for (let i = 0; i < Object.keys(finalResponseProcessed[0]).length; i++) {
    const key = Object.keys(finalResponseProcessed[0])[i];
    finalResponseProcessed[0][key] = finalResponseProcessed[0][key].flat();
  }

  if (Object.keys(finalResponseProcessed[0]).length === 1) {
    const finalResponseProcessedOneAttribute = finalResponseProcessed[0][Object.keys(finalResponseProcessed[0])[0]];
    return finalResponseProcessedOneAttribute;
  }
  return finalResponseProcessed;
};

export const getGeoData = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

export const checkAuthorization = async () => {
  return axios.get('/api/authorization');
};

export const getAvailableDates = async (attributeId) => {
  const response = await axios.get(`/api/attributes/${attributeId}/availableDates`);
  return response.data;
};

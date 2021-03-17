const fetchWithOptions = async (url: RequestInfo, options?: RequestInit) => {
  const resp = await fetch(`${process.env.REACT_APP_EXCHANGE_API_BASE_URL}${url}`, options);
  let data = null;
  try {
    data = await resp.json();
  } catch (e) {
    console.error(e);
  }

  return data;
};

export default fetchWithOptions;

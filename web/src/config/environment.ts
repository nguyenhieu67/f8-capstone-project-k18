const getApiRoot = (): string => {
  if (import.meta.env.DEV) {
    return "http://localhost:3001/";
  }

  return import.meta.env.VITE_API_URL;
};

const env = {
  API_ROOT: getApiRoot(),
};

export default env;

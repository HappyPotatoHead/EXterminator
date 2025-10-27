const KEY_NAME = "userAPI";

export const getApiKey = () => { return localStorage.getItem(KEY_NAME); }
export const setApiKey = (token) => { localStorage.setItem(KEY_NAME, token); }
export const clearApiKey = () => { localStorage.removeItem(KEY_NAME); }
export const hasApiKey = () => { return !!getApiKey(); }
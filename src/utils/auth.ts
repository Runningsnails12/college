const TOKEN_KEY = '__TOKEN';
export function getTokenAUTH() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setTokenAUTH(v: any) {
  return localStorage.setItem(TOKEN_KEY, v);
}
export function removeTokenAUTH() {
  return localStorage.removeItem(TOKEN_KEY);
}
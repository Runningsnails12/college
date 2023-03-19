export function isToday(day: string) {
  const now = new Date();
  const expire = new Date(day);
  const nowDay = '' + now.getFullYear() + (now.getMonth() + 1) + now.getDate()
  const expireDay = '' + expire.getFullYear() + (expire.getMonth() + 1) + expire.getDate()
  if (nowDay === expireDay) return true;
  return false
}
import Http from "./axios";

export async function getUserInfo() {
  return Http({
    url: '/user/getUserInfo',
    method: 'get',
  })
}
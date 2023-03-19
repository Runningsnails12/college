import Http from "./axios";

export async function getFileToken() {
  return Http({
    url: '/fileToken',
    method: 'GET',
  })
}
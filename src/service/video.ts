import Http from "./axios";

export async function addVideo(data: any) {
  return Http({
    url: '/video',
    method: 'post',
    data
  })
}
export async function getVideo(data: any) {
  return Http({
    url: '/video',
    method: 'get',
    params:{
      p:data
    }
  })
}

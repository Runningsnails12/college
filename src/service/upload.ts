import Http from "./axios";

export async function addClassImformation(data: any) {
  return Http({
    url: '/class/upload',
    method: 'post',
    data
  })
}
export async function getClassImformation(data: any) {
  return Http({
    url: '/class/upload',
    method: 'get',
    params: {
      classId: data
    }
  })
}
export async function deleteFileByFileName(data: any) {
  return Http({
    url: '/class/upload',
    method: 'delete',
    params: {
      uploadId: data
    }
  })
}

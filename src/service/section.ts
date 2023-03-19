import Http from "./axios";

export async function getAllSection(classId: any) {
  return Http({
    url: '/section/all',
    method: 'get',
    params:{
      classId
    }
  })
}
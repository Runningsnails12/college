import Http from "./axios";


export async function getCatalogue(id: string) {
  return Http({
    url: '/catalogue/getCatalogue',
    method: 'get',
    params: {
      classId: id
    }
  })
}
export async function updateCatalogue(data: any) {
  return Http({
    url: '/catalogue/updateCatalogue',
    method: 'post',
    data
  })
}
export async function addCatalogue(data: any) {
  return Http({
    url: '/catalogue/addCatalogue',
    method: 'post',
    data
  })
}

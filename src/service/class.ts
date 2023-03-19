import Http from "./axios";

export async function getMyClass() {
  return Http({
    url: '/class/getMyClass',
    method: 'GET',
  })
}

export async function joinClass(data: any) {
  return Http({
    url: '/class/join',
    method: 'GET',
    params: {
      code: data
    }
  })
}


export async function getMyClassmate(data: number) {
  return Http({
    url: '/class/getMyClassmate',
    method: 'GET',
    params: {
      classId: data
    }
  })
}
export async function getMyClassInfo() {
  return Http({
    url: '/class/classInfo',
    method: 'GET',
  })
}
export async function getClassCatalogue(classId: any) {
  return Http({
    url: '/class/catalogue',
    method: 'GET',
    params: {
      classId
    }
  })
}

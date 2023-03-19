import Http from "./axios";

export async function getProblem(data: any) {
  return Http({
    url: '/problem',
    method: 'get',
    params: {
      problemId: data
    }
  })
}

export async function addMultipleChooseProblem(data: any) {
  return Http({
    url: '/problem/multiple',
    method: 'post',
    data
  })
}

export async function updateMultipleChooseProblem(data: any) {
  return Http({
    url: '/problem/multiple',
    method: 'patch',
    data
  })
}

export async function deleteMultipleChooseProblem(data: any) {
  return Http({
    url: '/problem/multiple',
    method: 'delete',
    params: {
      problemId: data
    }
  })
}

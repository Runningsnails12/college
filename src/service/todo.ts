import Http from "./axios";

export async function getTodoNotion() {
  return Http({
    url: '/todo/notion',
    method: 'get',
  })
}

export async function getTodoTask() {
  return Http({
    url: '/todo/task',
    method: 'get',
  })
}


export async function addTodoNotion(data: any) {
  return Http({
    url: '/todo/notion',
    method: 'post',
    data
  })
}

export async function addTodoTask(data: any) {
  return Http({
    url: '/todo/task',
    method: 'post',
    data
  })
}

export async function deleteTodoNotion(data: any) {
  return Http({
    url: '/todo/notion',
    method: 'delete',
    params: {
      notionId: data
    }
  })
}
export async function getTodoTaskComment(data: any) {
  return Http({
    url: '/todo/task/state',
    method: 'get',
    params: {
      taskId: data
    }
  })
}
export async function addTodoTaskComment(data: any) {
  return Http({
    url: '/todo/task/state',
    method: 'post',
    data
  })
}
export async function updateTodoTaskState(data: any) {
  return Http({
    url: '/todo/task/finishState',
    method: 'post',
    data
  })
}
export async function addTaskUploadList(data: any) {
  return Http({
    url: '/todo/task/upload',
    method: 'post',
    data
  })
}
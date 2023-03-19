import { removeTokenAUTH } from "@/utils/auth";
import Http from "./axios";

export async function register(username: string, password: string) {
  return Http({
    url: '/login/register',
    method: 'post',
    data: {
      username, password
    }
  })
}

export async function login(username: string, password: string) {
  return Http({
    url: '/login/login',
    method: 'post',
    data: {
      username, password
    }
  })
}

export function logout() {
  return removeTokenAUTH()
}

export async function getRootPermission() {
  return Http({
    url: '/permission',
    method: 'get',
  })
}


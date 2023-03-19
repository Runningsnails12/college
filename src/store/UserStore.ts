import { User } from "@/entity/User";
import { getUserInfo } from "@/service/user";
import { makeAutoObservable, runInAction } from "mobx";

class UserStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
  user = {} as User
  async setUserInfo() {
    let userData = JSON.parse(window.localStorage.getItem('user'))
    if (!userData) {
      const { data } = await getUserInfo()
      userData = data
      window.localStorage.setItem('user', JSON.stringify(data))
    }
    runInAction(() => {
      this.user = userData
    })
  }
}
export default new UserStore()

export type {
  UserStore
}
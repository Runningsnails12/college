import { createContext, useContext } from "react";
import UserStore from "./UserStore";

class Store {
  UserStore = UserStore
}
const context = createContext(new Store())

export default function useStore() {
  return useContext(context)
}
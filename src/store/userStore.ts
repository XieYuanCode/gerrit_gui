import { defineStore } from 'pinia'
import { tauriStore } from '.'
import { loginGerrit } from '../message/login'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      email: "",
      name: "",
      registered_on: "",
      username: ""
    }
  },
  actions: {
    async login(address: string, username: string, password: string) {
      try {
        const result = await loginGerrit(address, username, password)
        await tauriStore.set("user", result)
        await tauriStore.set("password", password)
        await tauriStore.set("address", address)
        await tauriStore.save()

        this.email = result.email
        this.name = result.name
        this.registered_on = result.registered_on
        this.username = result.username
      } catch (error) {
        throw error
      }
    },
    async logout() {
      try {
        await tauriStore.delete("user")
        await tauriStore.delete("password")
        await tauriStore.delete("address")
        await tauriStore.save()

        this.email = ""
        this.name = ""
        this.registered_on = ""
        this.username = ""

      } catch (error) {
        throw error
      }
    }
  }
})
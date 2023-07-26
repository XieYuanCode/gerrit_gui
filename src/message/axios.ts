import axios from "axios";
import type { AxiosBasicCredentials } from "axios"
import type { AxiosInstance } from "axios"
import axiosTauriAdapter from 'axios-tauri-adapter';

export class AxiosInstanceManager {
  private _instances: Map<string, AxiosInstance> = new Map<string, AxiosInstance>()

  public currentLoginedAddress: string | undefined
  public currentLoginAuth: AxiosBasicCredentials | undefined

  public get(address: string): AxiosInstance {
    if (!this._instances.has(address)) {
      this._instances.set(address, axios.create({
        baseURL: address,
        headers: {
          Accept: "*/*"
        },
        adapter: axiosTauriAdapter,
        responseType: "text"
      }))
    }

    return this._instances.get(address)!
  }

  public getCurrentActivated() {
    if (!this.currentLoginedAddress) return

    return this.get(this.currentLoginedAddress)
  }
}

export default new AxiosInstanceManager()
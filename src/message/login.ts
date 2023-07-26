// import { fetch, ResponseType } from '@tauri-apps/api/http';
import axiosInstanceManager from './axios';

export interface ILoginResult {
  email: string
  name: string
  registered_on: string
  username: string
}

export const loginGerrit = async (address: string, username: string, password: string): Promise<ILoginResult> => {
  const instance = axiosInstanceManager.get(address)

  try {
    const response = await instance.get(`/a/accounts/self/detail`, {
      auth: {
        username,
        password
      }
    });

    if (response.status === 200) {
      axiosInstanceManager.currentLoginedAddress = address
      axiosInstanceManager.currentLoginAuth = {
        username,
        password
      }
      return JSON.parse((response.data as string).replace(")]}'", "")) as ILoginResult
    } else {
      throw new Error(response.status.toString())
    }

  } catch (error) {
    throw error
  }
}
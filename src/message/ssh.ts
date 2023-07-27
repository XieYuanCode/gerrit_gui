import axiosInstanceManager from "./axios"

export interface IGerritRemoteSSHConfig {
  seq?: number
  ssh_public_key?: string
  encoded_key?: string
  algorithm?: string
  comment?: string
  valid?: boolean
}
export const getRemoteSSHConfigs = async (): Promise<IGerritRemoteSSHConfig[]> => {
  const instance = axiosInstanceManager.getCurrentActivated()!

  try {
    const getSSHResponse = await instance.get("/a/accounts/self/sshkeys", {
      auth: axiosInstanceManager.currentLoginAuth
    })

    if (getSSHResponse.status === 200) {
      const remoteSSHConfigs = JSON.parse((getSSHResponse.data as string).replace(")]}'", "")) as IGerritRemoteSSHConfig[]
      return remoteSSHConfigs
    } else {
      throw new Error(getSSHResponse.status.toString())
    }
  } catch (error) {
    console.log(error);
    throw error
  }
}
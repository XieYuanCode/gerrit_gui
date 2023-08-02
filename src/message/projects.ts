import axiosInstanceManager from './axios';

export interface IGerritProjectWebLink {
  name: string
  url: string
}

export interface IGerritProject {
  id: string
  name: string
  parent: string
  description: string
  state: string
  web_links: IGerritProjectWebLink[]
}

export const getProjects = async (): Promise<Array<IGerritProject>> => {
  const instance = axiosInstanceManager.getCurrentActivated()!

  try {
    const projectsResponse = await instance.get(`/a/projects/?n=26&S=0&query=state%3Aactive%20OR%20state%3Aread-only`, {
      auth: axiosInstanceManager.currentLoginAuth
    })

    if (projectsResponse.status === 200) {
      const projects = JSON.parse((projectsResponse.data as string).replace(")]}'", "")) as Array<IGerritProject>

      return projects
    } else {
      throw new Error(projectsResponse.status.toString())
    }
  } catch (error) {
    throw error
  }
}

import { UserInfo } from '@/network/api/api-res-model'
import { create } from 'zustand'
import { login } from '@/network/api/api'

interface UserStore {
  userInfo: Partial<UserInfo>,
  token: string,
  login: (user: Pick<UserInfo, "username" | 'password'>) =>
    Promise<{ token: string, userInfo: UserInfo }>,
  logout: () => Promise<void>
}
export const useUserStore = create<UserStore>((set) => ({
  userInfo: {},
  token: '',
  login: (user) => new Promise(resolve => {
    login(user).then(res => {
      set({ userInfo: res.userInfo })
      set({ token: res.token })
      localStorage.setItem('token', res.token)
      resolve(res)
    })
  }),
  logout: () => {
    return new Promise<void>(resolve => {
      set({ userInfo: {} })
      set({ token: '' })
      localStorage.removeItem('token')
      resolve()
    })
  }
}))

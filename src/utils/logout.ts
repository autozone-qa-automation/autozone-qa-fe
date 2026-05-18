export const logout = (): void => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('name')
  localStorage.removeItem('role')
  localStorage.removeItem('sureName')
  localStorage.removeItem('userEmail')
}

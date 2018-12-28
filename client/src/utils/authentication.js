const isAuthenticated = () => localStorage.getItem('isAuthenticated');
const hasUser = () => localStorage.getItem('user');

export {
  isAuthenticated,
  hasUser
}
const isAuthenticated = () => localStorage.getItem('isAuthenticated');
const hasUser = () => localStorage.getItem('user');

const isTeacher = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.role === 'teacher';
}

const isStudent = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.role === 'student';
}

export {
  isAuthenticated,
  hasUser,
  isTeacher,
  isStudent
}

export const getDefaultRoute = (role: string) => {
  switch (role) {
    case "admin":
      return "/admin/users"
    case "teacher":
      return "/teacher/dashboard"
    case "student":
      return "/student/dashboard"
    default:
      return "/login"
  }
}
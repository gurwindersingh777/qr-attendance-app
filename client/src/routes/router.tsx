import { createBrowserRouter, Navigate } from "react-router-dom";
import RootRedirect from "./RootRedirect";
import PublicRoute from "./PublicRoute";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import StudentLayout from "@/components/layout/StudentLayout";
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentSubjects from "@/pages/student/StudentSubjects";
import StudentScanQR from "@/pages/student/StudentScanQR";
import StudentSubjectDetail from "@/pages/student/StudentSubjectDetail";
import TeacherLayout from "@/components/layout/TeacherLayout";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import TeacherSubjects from "@/pages/teacher/TeacherSubjects";
import TeacherSession from "@/pages/teacher/TeacherSession";
import TeacherReport from "@/pages/teacher/TeacherReport";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminUserDetail from "@/pages/admin/AdminUserDetail";
import AdminSubjects from "@/pages/admin/AdminSubjects";

export const router = createBrowserRouter([

  { path: "/", element: <RootRedirect /> },
  { path: "*", element: <Navigate to="/" replace /> },
  { path: "/login", element: <PublicRoute><Login /></PublicRoute> },
  { path: "/register", element: <PublicRoute><Register /></PublicRoute> },
  {
    path: "/student",
    element: (<ProtectedRoute allowedRole="student"><StudentLayout /></ProtectedRoute>),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <StudentDashboard /> },
      { path: "subjects", element: <StudentSubjects /> },
      { path: "scan", element: <StudentScanQR /> },
      { path: "subject/:id", element: <StudentSubjectDetail /> },
    ]
  },
  {
    path: "/teacher",
    element: (<ProtectedRoute allowedRole="teacher" ><TeacherLayout /></ProtectedRoute>),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <TeacherDashboard /> },
      { path: "subjects", element: <TeacherSubjects /> },
      { path: "session/:id", element: <TeacherSession /> },
      { path: "report/:id", element: <TeacherReport /> },
    ]
  },
  {
    path: "/admin",
    element: (<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>),
    children: [
      { index: true, element: <Navigate to="users" replace /> },
      { path: "users", element: <AdminUsers /> },
      { path: "users/:id", element: <AdminUserDetail /> },
      { path: "subjects", element: <AdminSubjects /> },
    ]
  }
]) 
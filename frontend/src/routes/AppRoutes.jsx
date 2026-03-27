import AppLayout from "../layouts/AppLayout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Events from "../pages/Events";
import CreateEvent from "../pages/CreateEvent";

import MyTickets from "../features/user/MyTickets";
import ScanTicket from "../features/staff/ScanTicket";
import CreateStaff from "../features/organiser/CreateStaff";
import AssignStaff from "../features/organiser/AssignStaff";

import ProtectedRoute from "./ProtectedRoute";

export const AppRoutes = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={["user", "organizer"]}>
            <Events />
          </ProtectedRoute>
        )
      },
      {
        path: "/create-event",
        element: (
          <ProtectedRoute allowedRoles={["organizer"]}>
            <CreateEvent />
          </ProtectedRoute>
        )
      },
      {
        path: "/my-tickets",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <MyTickets />
          </ProtectedRoute>
        )
      },
      {
        path: "/scan",
        element: (
          <ProtectedRoute allowedRoles={["staff", "organizer"]}>
            <ScanTicket />
          </ProtectedRoute>
        )
      },
      {
        path: "/create-staff",
        element: (
          <ProtectedRoute allowedRoles={["organizer"]}>
            <CreateStaff />
          </ProtectedRoute>
        )
      },
      {
        path: "/assign-staff",
        element: (
          <ProtectedRoute allowedRoles={["organizer"]}>
            <AssignStaff />
          </ProtectedRoute>
        )
      }
    ]
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> }
];
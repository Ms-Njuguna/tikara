import AppLayout from "../layouts/AppLayout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Events from "../pages/Events";
import CreateEvent from "../pages/CreateEvent";

export const AppRoutes = [
    { path: "/",
      element: <AppLayout />,
      children: [
         {index: true, element: <Events />},
         {path: "/create-event", element: <CreateEvent />},
        ]
    },
    {path: "/login", element: <Login />},
    {path: "/register", element: <Register />},
]
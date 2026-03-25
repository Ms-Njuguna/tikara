import Login from "../pages/Login";
import Register from "../pages/Register";

import Events from "../pages/Events";
import CreateEvent from "../pages/CreateEvent";

export const AppRoutes = [
    {path: "/", element: <Events />},
    {path: "/login", element: <Login />},
    {path: "/register", element: <Register />},
    {path: "/create-event", element: <CreateEvent />},
]
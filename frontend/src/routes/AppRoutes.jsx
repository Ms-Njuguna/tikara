import Login from "../pages/Login";
import Register from "../pages/Register";

import Events from "../pages/Events";

export const AppRoutes = [
    {path: "/", element: <Events />},
    {path: "/login", element: <Login />},
    {path: "/register", element: <Register />},
]
import { Outlet } from "react-router-dom";
import Nav from "../components/Navbar";

export default function AppLayout() {
    return (
        <div>
            <Nav />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}
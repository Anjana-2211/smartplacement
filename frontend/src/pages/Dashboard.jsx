import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";

export default function Dashboard() {
    const { user } = useContext(AuthContext);

    if (!user) {
        return null;
    }

    return user.role === "admin" ? <AdminDashboard /> : <StudentDashboard />;
}

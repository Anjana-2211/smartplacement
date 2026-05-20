import "./App.css";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Companies from "./pages/Companies";
import AdminDashboard from "./pages/AdminDashboard";
import AddCompany from "./pages/admin/AddCompany";
import StudentDashboard from "./pages/StudentDashboard";

export default function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={<Navigate replace to="/student" />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/companies"
                    element={
                        <ProtectedRoute>
                            <Companies />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student"
                    element={
                        <ProtectedRoute>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/add-company"
                    element={
                        <ProtectedRoute>
                            <AddCompany />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

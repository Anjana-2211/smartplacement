import "./App.css";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Companies from "./pages/Companies";
import Dashboard from "./pages/Dashboard";
import AddCompany from "./pages/admin/AddCompany";
import CompanyApplicationReport from "./pages/admin/CompanyApplicationReport";

export default function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
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
                    path="/admin/add-company"
                    element={
                        <ProtectedRoute>
                            <AddCompany />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/report/:companyId"
                    element={
                        <ProtectedRoute>
                            <CompanyApplicationReport />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

export default function Navbar() {

    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (

        <nav className="navbar">

            <Link to="/">
                Dashboard
            </Link>

            <Link to="/companies">
                Companies
            </Link>

            {user?.role === "admin" && (
                <Link to="/admin/add-company">
                    Add Company
                </Link>
            )}

            {
                !user ? (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                ) : (
                    <button className="btn" onClick={handleLogout}>
                        Logout
                    </button>
                )
            }

        </nav>
    );
}

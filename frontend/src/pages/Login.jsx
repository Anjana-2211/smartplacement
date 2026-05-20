import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

import { AuthContext } from "../context/AuthContext";

export default function Login() {

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const loginUser = async () => {

        const res = await API.post(
            "/auth/login",
            form
        );

        login(res.data.user, res.data.token);

        alert("Login Success");

        if (res.data.user.role === "admin") {
            navigate("/admin");
        } else {
            navigate("/student");
        }
    };

    return (

        <main className="page-shell">
            <section className="form-section">
                <h1>Login</h1>
            </section>

            <section className="form-grid">
                <input
                    className="form-input"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value
                        })
                    }
                />

                <input
                    className="form-input"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password: e.target.value
                        })
                    }
                />

                <button className="btn" onClick={loginUser}>
                    Login
                </button>
            </section>
        </main>
    );
}

import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";

import { AuthContext } from "../context/AuthContext";

export default function Login() {

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const loginUser = async () => {

        const res = await API.post(
            "/auth/login",
            form
        );

        login(res.data.user, res.data.token);

        navigate(from, { replace: true });
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

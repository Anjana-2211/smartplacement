import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
        rollNumber: "",
        branch: "CSE",
        cgpa: "",
        backlogs: 0
    });

    const navigate = useNavigate();

    const registerUser = async () => {
        await API.post("/auth/register", form);

        alert("Registered Successfully");
        navigate("/login");
    };
    return (

        <main className="page-shell">
            <section className="form-section">
                <h1>Register</h1>
            </section>

            <section className="form-grid">
                <select
                    className="form-input"
                    value={form.role}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            role: e.target.value,
                        })
                    }
                >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                </select>

                <input
                    className="form-input"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name: e.target.value
                        })
                    }
                />

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

                {form.role === "student" && (
                    <>
                        <input
                            className="form-input"
                            placeholder="Roll Number"
                            value={form.rollNumber}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    rollNumber: e.target.value
                                })
                            }
                        />

                        <select
                            className="form-input"
                            value={form.branch}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    branch: e.target.value
                                })
                            }
                        >
                            <option value="CSE">CSE</option>
                            <option value="CSE-AI">CSE-AI</option>
                            <option value="IT">IT</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="MECH">MECH</option>
                            <option value="CIVIL">CIVIL</option>
                        </select>

                        <input
                            className="form-input"
                            type="number"
                            min="0"
                            max="10"
                            step="0.01"
                            placeholder="CGPA"
                            value={form.cgpa}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    cgpa: e.target.value
                                })
                            }
                        />

                        <select
                            className="form-input"
                            value={form.backlogs}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    backlogs: Number(e.target.value)
                                })
                            }
                        >
                            <option value={0}>0 backlogs</option>
                            <option value={1}>1 backlog</option>
                            <option value={2}>2 backlogs</option>
                            <option value={3}>More than 2 backlogs</option>
                        </select>
                    </>
                )}

                <button className="btn" onClick={registerUser}>
                    Register
                </button>
            </section>
        </main>
    );
}

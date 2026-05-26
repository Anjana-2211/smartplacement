import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileForm, setProfileForm] = useState({
        name: "",
        cgpa: "",
        backlogs: 0
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (loggedInUser && loggedInUser._id) {
            fetchProfile();
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await API.get(`/auth/profile/${loggedInUser._id}`);
            setUser(res.data.user);
            setStudent(res.data.student);
            setProfileForm({
                name: res.data.user.name,
                cgpa: res.data.student?.cgpa || "",
                backlogs: res.data.student?.backlogs || 0
            });
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch profile", err);
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/auth/update-profile/${loggedInUser._id}`, profileForm);
            toast.success("Profile updated successfully!");
            fetchProfile();
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return toast.error("New passwords do not match");
        }
        try {
            await API.put(`/auth/change-password/${loggedInUser._id}`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            toast.success("Password changed successfully!");
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            toast.error(err.response?.data?.message || "Password change failed");
        }
    };

    if (loading) return <div className="page-shell">Loading...</div>;

    return (
        <main className="page-shell">
            <section className="form-section">
                <h1>My Profile</h1>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
                {student && (
                    <p><strong>Roll Number:</strong> {student.rollNumber} | <strong>Section:</strong> {student.section} | <strong>Branch:</strong> {student.branch}</p>
                )}
            </section>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                <section className="form-section">
                    <h2>Edit Details</h2>
                    <form onSubmit={handleProfileUpdate} className="form-grid" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <label><strong>Name</strong></label>
                            <input
                                className="form-input"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                required
                            />
                        </div>
                        {user?.role === "student" && (
                            <>
                                <div>
                                    <label><strong>CGPA</strong></label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="10"
                                        value={profileForm.cgpa}
                                        onChange={(e) => setProfileForm({ ...profileForm, cgpa: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label><strong>Backlogs</strong></label>
                                    <select
                                        className="form-input"
                                        value={profileForm.backlogs}
                                        onChange={(e) => setProfileForm({ ...profileForm, backlogs: Number(e.target.value) })}
                                    >
                                        <option value={0}>0 backlogs</option>
                                        <option value={1}>1 backlog</option>
                                        <option value={2}>2 backlogs</option>
                                        <option value={3}>More than 2 backlogs</option>
                                    </select>
                                </div>
                            </>
                        )}
                        <button type="submit" className="btn">Update Profile</button>
                    </form>
                </section>

                <section className="form-section">
                    <h2>Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="form-grid" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <label><strong>Current Password</strong></label>
                            <input
                                className="form-input"
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label><strong>New Password</strong></label>
                            <input
                                className="form-input"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label><strong>Confirm New Password</strong></label>
                            <input
                                className="form-input"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn">Change Password</button>
                    </form>
                </section>
            </div>
        </main>
    );
}
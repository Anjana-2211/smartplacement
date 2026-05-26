﻿import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import CompanyCard from "../components/CompanyCard";

export default function StudentDashboard() {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    const [eligibleCompanies, setEligibleCompanies] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        getProfile();
        getApplications();
    }, []);

    const getProfile = async () => {
        const res = await API.get("/students/profile");
        setProfile(res.data);
    };

    const getApplications = async () => {
        const res = await API.get("/applications/my-applications");
        setApplications(res.data);
    };

    return (
        <main className="page-shell">
            <section className="form-section">
                <h1>Student Dashboard</h1>
                <p>Manage your profile and track your application status.</p>
            </section>

            <section className="dashboard-grid">
                <div className="profile-card">
                    <h2>My Profile</h2>
                    {profile ? (
                        <>
                            <p><strong>Name:</strong> {profile.user?.name}</p>
                            <p><strong>Branch:</strong> {profile.branch}</p>
                            <p><strong>CGPA:</strong> {profile.cgpa}</p>
                            <p><strong>Backlogs:</strong> {profile.backlogs}</p>
                            <button 
                                className="btn" 
                                style={{ marginTop: "1rem", width: "auto", padding: "8px 16px" }}
                                onClick={() => navigate("/profile")}
                            >
                                Edit Profile / Change Password
                            </button>
                        </>
                    ) : (
                        <p>Loading profile...</p>
                    )}
                </div>

                <div className="profile-card">
                    <h2>Application Summary</h2>
                    <p>{applications.length} applications submitted</p>
                    {applications.map((application) => (
                        <div key={application._id} className="status-pill status-applied">
                            {application.company?.companyName || "Company"} - {application.status}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

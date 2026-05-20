import { useEffect, useState } from "react";
import API from "../api";
import CompanyCard from "../components/CompanyCard";

export default function StudentDashboard() {
    const [profile, setProfile] = useState(null);
    const [eligibleCompanies, setEligibleCompanies] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        getProfile();
        getEligibleCompanies();
        getApplications();
    }, []);

    const getProfile = async () => {
        const res = await API.get("/students/profile");
        setProfile(res.data);
    };

    const getEligibleCompanies = async () => {
        const res = await API.get("/students/eligible");
        setEligibleCompanies(res.data.companies || []);
    };

    const getApplications = async () => {
        const res = await API.get("/applications/my-applications");
        setApplications(res.data);
    };

    const apply = async (companyId) => {
        await API.post(`/applications/apply/${companyId}`);
        alert("Applied Successfully");
        getApplications();
        getEligibleCompanies();
    };

    const applicationMap = applications.reduce((map, application) => {
        if (application.company?._id) {
            map[application.company._id] = application.status;
        }
        return map;
    }, {});

    const appliedCompanies = eligibleCompanies.filter((company) =>
        applicationMap[company._id]
    );

    const notAppliedCompanies = eligibleCompanies.filter(
        (company) => !applicationMap[company._id]
    );

    return (
        <main className="page-shell">
            <section className="form-section">
                <h1>Student Dashboard</h1>
                <p>View eligible opportunities, apply for drives, and track your status.</p>
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

            <section>
                <div className="section-title">Available to Apply</div>
                {notAppliedCompanies.length > 0 ? (
                    <div className="card-grid">
                        {notAppliedCompanies.map((company) => (
                            <CompanyCard
                                key={company._id}
                                company={company}
                                actionLabel="Apply"
                                onAction={() => apply(company._id)}
                                disabled={false}
                                status="Eligible"
                            />
                        ))}
                    </div>
                ) : (
                    <p>No more eligible companies to apply.</p>
                )}
            </section>

            <section>
                <div className="section-title">Applied Companies</div>
                {appliedCompanies.length > 0 ? (
                    <div className="card-grid">
                        {appliedCompanies.map((company) => (
                            <CompanyCard
                                key={company._id}
                                company={company}
                                actionLabel={applicationMap[company._id]}
                                onAction={() => {}}
                                disabled={true}
                                status={applicationMap[company._id]}
                            />
                        ))}
                    </div>
                ) : (
                    <p>You haven't applied to any companies yet.</p>
                )}
            </section>
        </main>
    );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";

const statusOptions = [
    "Applied",
    "Round 1 Cleared",
    "Round 2 Cleared",
    "HR Round Cleared",
    "Selected",
    "Rejected",
];

export default function CompanyApplicationReport() {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [applications, setApplications] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedSection, setSelectedSection] = useState("All");
    const [selectedBranch, setSelectedBranch] = useState("All");
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        getCompanyDetails();
        getApplications();
    }, [companyId]);

    const getCompanyDetails = async () => {
        try {
            const res = await API.get(`/companies/${companyId}`);
            setCompany(res.data);
        } catch (err) {
            console.error("Failed to fetch company details", err);
        }
    };

    const getApplications = async () => {
        try {
            const res = await API.get("/applications/all");
            const filtered = res.data.filter(
                (app) => app.company?._id === companyId
            );
            setApplications(filtered);
        } catch (err) {
            console.error("Failed to fetch applications", err);
        }
    };

    const updateStatus = async (applicationId, status) => {
        try {
            await API.put(`/applications/status/${applicationId}`, { status });
            getApplications();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const filteredApplications = applications
        .filter((app) => selectedStatus === "All" || app.status === selectedStatus)
        .filter((app) => selectedSection === "All" || app.student?.section === selectedSection)
        .filter((app) => selectedBranch === "All" || app.student?.branch === selectedBranch)
        .sort((a, b) => {
            const sectionOrder = ["A", "B", "C"];
            const sectionA = a.student?.section || "Unknown";
            const sectionB = b.student?.section || "Unknown";
            const sectionDiff = sectionOrder.indexOf(sectionA) - sectionOrder.indexOf(sectionB);
            if (sectionDiff !== 0) return sectionDiff;
            const rollA = parseInt(a.student?.rollNumber || 0);
            const rollB = parseInt(b.student?.rollNumber || 0);
            return rollA - rollB;
        });

    const uniqueBranches = [...new Set(applications.map((app) => app.student?.branch).filter(Boolean))].sort();
    const uniqueSections = ["A", "B", "C"].filter((s) => applications.some((a) => a.student?.section === s));

    const statsSummary = () => {
        const stats = {
            total: filteredApplications.length,
            applied: filteredApplications.filter((a) => a.status === "Applied").length,
            selected: filteredApplications.filter((a) => a.status === "Selected").length,
            rejected: filteredApplications.filter((a) => a.status === "Rejected").length,
        };
        return stats;
    };

    const stats = statsSummary();

    return (
        <main className="page-shell">
            <section className="form-section">
                <button className="btn" onClick={() => navigate("/")} style={{ marginBottom: "1rem" }}>
                    ← Back to Dashboard
                </button>
                <h1>{company?.companyName || "Company Report"}</h1>
                <p><strong>Role:</strong> {company?.jobRole} | <strong>Package:</strong> {company?.ctc}</p>
                <p><strong>Min CGPA:</strong> {company?.minCGPA} | <strong>Max Backlogs:</strong> {company?.maxBacklogs} | <strong>Eligible Branches:</strong> {company?.eligibleBranches?.join(", ")}</p>
            </section>

            <section className="stats-grid">
                <div className="profile-card">
                    <h2>Total Applications</h2>
                    <p>{stats.total}</p>
                </div>
                <div className="profile-card">
                    <h2>Applied</h2>
                    <p>{stats.applied}</p>
                </div>
                <div className="profile-card">
                    <h2>Selected</h2>
                    <p>{stats.selected}</p>
                </div>
                <div className="profile-card">
                    <h2>Rejected</h2>
                    <p>{stats.rejected}</p>
                </div>
            </section>

            <section className="form-section">
                <div className="form-grid">
                    <div>
                        <label><strong>Filter by Status</strong></label>
                        <select
                            className="form-input"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            {statusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label><strong>Filter by Section</strong></label>
                        <select
                            className="form-input"
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                        >
                            <option value="All">All Sections</option>
                            {uniqueSections.map((section) => (
                                <option key={section} value={section}>
                                    Section {section}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label><strong>Filter by Branch</strong></label>
                        <select
                            className="form-input"
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                        >
                            <option value="All">All Branches</option>
                            {uniqueBranches.map((branch) => (
                                <option key={branch} value={branch}>
                                    {branch}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {filteredApplications.length === 0 ? (
                <section className="form-section">
                    <p>No applications found for this filter.</p>
                </section>
            ) : (
                <section className="form-section">
                    <h3>All Student Applications ({filteredApplications.length})</h3>
                    <div className="app-table">
                        <div className="app-row app-row--head">
                            <div><strong>Section</strong></div>
                            <div><strong>Student Name</strong></div>
                            <div><strong>Email</strong></div>
                            <div><strong>Roll No</strong></div>
                            <div><strong>Branch</strong></div>
                            <div><strong>CGPA</strong></div>
                            <div><strong>Backlogs</strong></div>
                            <div><strong>Status</strong></div>
                            <div><strong>Action</strong></div>
                        </div>
                        {filteredApplications.map((app) => (
                            <div key={app._id} className="app-row">
                                <div><strong>{app.student?.section || "-"}</strong></div>
                                <div>
                                    <button
                                        className="btn"
                                        style={{
                                            background: "none",
                                            border: "none",
                                            padding: 0,
                                            color: "#0b5ed7",
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                            fontSize: "0.95rem",
                                        }}
                                        onClick={() => setSelectedStudent(app.student)}
                                    >
                                        {app.student?.user?.name || app.student?.name || "-"}
                                    </button>
                                </div>
                                <div style={{ fontSize: "0.9rem" }}>{app.student?.user?.email || "-"}</div>
                                <div>{app.student?.rollNumber || "-"}</div>
                                <div>{app.student?.branch || "-"}</div>
                                <div>{app.student?.cgpa ?? "-"}</div>
                                <div>{app.student?.backlogs ?? "-"}</div>
                                <div>
                                    <span
                                        style={{
                                            padding: "0.25rem 0.5rem",
                                            borderRadius: "4px",
                                            fontSize: "0.85rem",
                                            backgroundColor: app.status === "Selected" ? "#d4edda" : app.status === "Rejected" ? "#f8d7da" : "#e7e7ff",
                                            color: app.status === "Selected" ? "#155724" : app.status === "Rejected" ? "#721c24" : "#004085",
                                        }}
                                    >
                                        {app.status}
                                    </span>
                                </div>
                                <div>
                                    <select
                                        value={app.status}
                                        onChange={(e) => updateStatus(app._id, e.target.value)}
                                        style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {selectedStudent && (
                <section className="form-section">
                    <h2>Student Report</h2>
                    <div className="profile-card">
                        <p><strong>Name:</strong> {selectedStudent.user?.name || selectedStudent.name}</p>
                        <p><strong>Email:</strong> {selectedStudent.user?.email}</p>
                        <p><strong>Section:</strong> {selectedStudent.section || "-"}</p>
                        <p><strong>Roll Number:</strong> {selectedStudent.rollNumber || "-"}</p>
                        <p><strong>Branch:</strong> {selectedStudent.branch || "-"}</p>
                        <p><strong>CGPA:</strong> {selectedStudent.cgpa ?? "-"}</p>
                        <p><strong>Backlogs:</strong> {selectedStudent.backlogs ?? "-"}</p>
                        <button className="btn" onClick={() => setSelectedStudent(null)}>
                            Close Report
                        </button>
                    </div>
                </section>
            )}
        </main>
    );
}

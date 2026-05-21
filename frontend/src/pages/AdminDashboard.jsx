import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const statusOptions = [
    "Applied",
    "Round 1 Cleared",
    "Round 2 Cleared",
    "HR Round Cleared",
    "Selected",
    "Rejected",
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [students, setStudents] = useState([]);
    const [applications, setApplications] = useState([]);
    const [editing, setEditing] = useState(null);
    const [editForm, setEditForm] = useState({
        companyName: "",
        jobRole: "",
        ctc: "",
        minCGPA: "",
        eligibleBranches: "",
        maxBacklogs: 0,
        registrationDeadline: "",
    });

    useEffect(() => {
        getCompanies();
        getStudents();
        getApplications();
    }, []);

    const getCompanies = async () => {
        const res = await API.get("/companies");
        setCompanies(res.data);
    };

    const getStudents = async () => {
        const res = await API.get("/students/all");
        setStudents(res.data);
    };

    const getApplications = async () => {
        const res = await API.get("/applications/all");
        setApplications(res.data);
    };

    const deleteCompany = async (companyId) => {
        if (!window.confirm("Delete this company?")) {
            return;
        }
        await API.delete(`/companies/${companyId}`);
        getCompanies();
    };

    const startEdit = (company) => {
        setEditing(company._id);
        setEditForm({
            companyName: company.companyName,
            jobRole: company.jobRole,
            ctc: company.ctc,
            minCGPA: company.minCGPA,
            eligibleBranches: company.eligibleBranches.join(", "),
            maxBacklogs: company.maxBacklogs,
            registrationDeadline: company.registrationDeadline?.slice(0, 10) || "",
        });
    };

    const saveCompanyChanges = async () => {
        if (!editing) return;

        await API.put(`/companies/${editing}`, {
            companyName: editForm.companyName,
            jobRole: editForm.jobRole,
            ctc: editForm.ctc,
            minCGPA: Number(editForm.minCGPA),
            eligibleBranches: editForm.eligibleBranches
                .split(",")
                .map((branch) => branch.trim())
                .filter(Boolean),
            maxBacklogs: Number(editForm.maxBacklogs),
            registrationDeadline: editForm.registrationDeadline,
        });

        setEditing(null);
        getCompanies();
    };

    const cancelEdit = () => {
        setEditing(null);
        setEditForm({
            companyName: "",
            jobRole: "",
            ctc: "",
            minCGPA: "",
            eligibleBranches: "",
            maxBacklogs: 0,
            registrationDeadline: "",
        });
    };

    const updateStatus = async (applicationId, status) => {
        await API.put(`/applications/status/${applicationId}`, { status });
        getApplications();
    };

    const companyAppCount = (companyId) => {
        return applications.filter((app) => app.company?._id === companyId).length;
    };

    return (
        <main className="page-shell">
            <section className="form-section">
                <h1>Admin Dashboard</h1>
                <p>View companies, manage placement activity, and update drive details.</p>
            </section>

            <section className="stats-grid">
                <div className="profile-card">
                    <h2>Companies</h2>
                    <p>{companies.length}</p>
                </div>
                <div className="profile-card">
                    <h2>Students</h2>
                    <p>{students.length}</p>
                </div>
                <div className="profile-card">
                    <h2>Applications</h2>
                    <p>{applications.length}</p>
                </div>
            </section>

            <section className="form-section">
                <h2>Company Listings</h2>
            </section>

            <div className="app-table">
                <div className="app-row app-row--head">
                    <div>Company</div>
                    <div>Role</div>
                    <div>CGPA / Backlogs</div>
                    <div>Actions</div>
                </div>
                {companies.map((company) => (
                    <div key={company._id} className="app-row">
                        <div>{company.companyName}</div>
                        <div>{company.jobRole}</div>
                        <div>
                            {company.minCGPA} CGPA / {company.maxBacklogs} backlogs
                        </div>
                        <div>
                            <button className="btn" onClick={() => startEdit(company)}>
                                Edit
                            </button>
                            <button className="btn" onClick={() => deleteCompany(company._id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editing && (
                <section>
                    <div className="form-section">
                        <h2>Edit Company</h2>
                    </div>
                    <section className="form-grid">
                        <input
                            className="form-input"
                            placeholder="Company Name"
                            value={editForm.companyName}
                            onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                        />
                        <input
                            className="form-input"
                            placeholder="Job Role"
                            value={editForm.jobRole}
                            onChange={(e) => setEditForm({ ...editForm, jobRole: e.target.value })}
                        />
                        <input
                            className="form-input"
                            placeholder="CTC"
                            value={editForm.ctc}
                            onChange={(e) => setEditForm({ ...editForm, ctc: e.target.value })}
                        />
                        <input
                            className="form-input"
                            type="number"
                            min="0"
                            max="10"
                            step="0.01"
                            placeholder="Min CGPA"
                            value={editForm.minCGPA}
                            onChange={(e) => setEditForm({ ...editForm, minCGPA: e.target.value })}
                        />
                        <input
                            className="form-input"
                            placeholder="Branches (comma separated)"
                            value={editForm.eligibleBranches}
                            onChange={(e) => setEditForm({ ...editForm, eligibleBranches: e.target.value })}
                        />
                        <input
                            className="form-input"
                            type="number"
                            min="0"
                            placeholder="Max Backlogs"
                            value={editForm.maxBacklogs}
                            onChange={(e) => setEditForm({ ...editForm, maxBacklogs: e.target.value })}
                        />
                        <input
                            className="form-input"
                            type="date"
                            value={editForm.registrationDeadline}
                            onChange={(e) => setEditForm({ ...editForm, registrationDeadline: e.target.value })}
                        />
                        <button className="btn" onClick={saveCompanyChanges}>
                            Save Changes
                        </button>
                        <button className="btn" onClick={cancelEdit}>
                            Cancel
                        </button>
                    </section>
                </section>
            )}

            <section className="form-section">
                <h2>Manage Applications</h2>
                <p>Click on a company to view detailed application report.</p>
            </section>

            <section className="form-section">
                <div className="section-title">Company Reports</div>
                <div className="card-grid">
                    {companies.map((company) => (
                        <button
                            key={company._id}
                            className="btn"
                            onClick={() => navigate(`/admin/report/${company._id}`)}
                        >
                            {company.companyName} ({companyAppCount(company._id)})
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
}

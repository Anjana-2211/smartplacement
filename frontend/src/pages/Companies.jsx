import {
    useEffect,
    useState
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../api";

import CompanyCard from "../components/CompanyCard";

export default function Companies() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    const [student, setStudent] = useState(null);
    const [applications, setApplications] = useState([]);
    const [activeTab, setActiveTab] = useState("available"); // "available" or "applied"
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    useEffect(() => {

        getCompanies();
        getStudentProfile();
        getApplications();

    }, []);

    const getCompanies = async () => {
        const res = await API.get(
            "/companies"
        );

        setCompanies(res.data);
    };

    const getStudentProfile = async () => {
        try {
            const res = await API.get("/students/profile");
            setStudent(res.data);
        } catch {
            setStudent(null);
        }
    };

    const getApplications = async () => {
        try {
            const res = await API.get("/applications/my-applications");
            setApplications(res.data);
        } catch {
            setApplications([]);
        }
    };

    const isDeadlineExpired = (deadline) => {
        if (!deadline) return false;
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(23, 59, 59, 999);
        return deadlineDate < new Date();
    };

    const apply = async (companyId, deadline) => {
        if (isDeadlineExpired(deadline)) {
            toast.error("Registration deadline has passed for this company.");
            return;
        }

        await API.post(
            `/applications/apply/${companyId}`
        );

        toast.success("Applied Successfully!");
        getApplications();
    };

    const alreadyAppliedIds = applications.map((app) => app.company?._id);

    const applicationStatusMap = applications.reduce((map, app) => {
        if (app.company?._id) map[app.company._id] = app.status;
        return map;
    }, {});

    const filteredCompanies = companies.filter((c) => {
        const matchesSearch = c.companyName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = c.jobRole.toLowerCase().includes(roleFilter.toLowerCase());
        const isIdMatch = id ? c._id === id : true;
        
        if (!matchesSearch || !matchesRole || !isIdMatch) return false;

        if (activeTab === "applied") return alreadyAppliedIds.includes(c._id);
        return !alreadyAppliedIds.includes(c._id);
    });

    const isEligible = (company) => {
        if (!student) return false;
        return (
            student.cgpa >= company.minCGPA &&
            company.eligibleBranches?.includes(student.branch) &&
            company.maxBacklogs >= student.backlogs
        );
    };

    return (

        <main className="page-shell">
            <section className="form-section">
                <h1>Company Listings</h1>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button 
                        className={`btn ${activeTab === "available" ? "" : "btn-secondary"}`} 
                        style={{ flex: 1 }}
                        onClick={() => setActiveTab("available")}
                    >
                        Available Drives
                    </button>
                    <button 
                        className={`btn ${activeTab === "applied" ? "" : "btn-secondary"}`} 
                        style={{ flex: 1 }}
                        onClick={() => setActiveTab("applied")}
                    >
                        My Applications
                    </button>
                </div>
            </section>

            <section className="form-section">
                <button className="btn-secondary" onClick={() => setShowFilters(!showFilters)}>
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
                {showFilters && (
                    <div className="form-grid" style={{ marginTop: "1rem", background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
                        <input 
                            className="form-input" 
                            placeholder="Search by Company Name..." 
                            value={searchQuery}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <input 
                            className="form-input" 
                            placeholder="Filter by Role (e.g. Developer)..." 
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        />
                    </div>
                )}
            </section>

            <section>
                <div className="section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{id ? "Selected Company Detail" : "Available Companies"}</span>
                    {id && (
                        <button
                            className="btn"
                            style={{ width: "auto", minHeight: "unset", padding: "8px 16px", fontSize: "0.85rem", margin: 0 }}
                            onClick={() => navigate("/companies")}
                        >
                            Show All Companies
                        </button>
                    )}
                </div>
                <div className="card-grid">
                    {filteredCompanies.map((company) => {
                        const expired = isDeadlineExpired(company.registrationDeadline);
                        const eligible = isEligible(company);
                        const status = applicationStatusMap[company._id];
                        const actionLabel = status
                            ? "Applied"
                            : expired
                                ? "Expired"
                                : "Apply";

                        return (
                            <CompanyCard
                                key={company._id}
                                company={company}
                                actionLabel={actionLabel}
                                onAction={() => apply(company._id, company.registrationDeadline)}
                                disabled={!!status || expired || !eligible}
                                status={status || (expired ? "Expired" : eligible ? "Eligible" : "Not eligible")}
                            />
                        );
                    })}
                </div>
                {filteredCompanies.length === 0 && (
                    <p style={{ textAlign: "center", marginTop: "2rem" }}>No companies found matching your criteria.</p>
                )}
            </section>
        </main>
    );
}

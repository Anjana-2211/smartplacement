import {
    useEffect,
    useState
} from "react";

import API from "../api";

import CompanyCard from "../components/CompanyCard";

export default function Companies() {

    const [companies, setCompanies] = useState([]);
    const [student, setStudent] = useState(null);
    const [applications, setApplications] = useState([]);

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
            alert("Registration deadline has passed for this company.");
            return;
        }

        await API.post(
            `/applications/apply/${companyId}`
        );

        alert("Applied Successfully");
        getApplications();
    };

    const alreadyAppliedIds = applications.map((app) => app.company?._id);

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
                <p>Browse active placement drives and check your eligibility in real time.</p>
            </section>

            <section className="dashboard-grid">
                <div className="profile-card">
                    <h2>Student Info</h2>
                    {student ? (
                        <>
                            <p><strong>Branch:</strong> {student.branch}</p>
                            <p><strong>CGPA:</strong> {student.cgpa}</p>
                            <p><strong>Backlogs:</strong> {student.backlogs}</p>
                        </>
                    ) : (
                        <p>Log in as a student to see eligibility details.</p>
                    )}
                </div>
                <div className="profile-card">
                    <h2>Applications</h2>
                    <p>{applications.length} total applications</p>
                </div>
            </section>

            <section>
                <div className="section-title">Available Companies</div>
                <div className="card-grid">
                    {companies.map((company) => {
                        const expired = isDeadlineExpired(company.registrationDeadline);
                        const eligible = isEligible(company);
                        const alreadyApplied = alreadyAppliedIds.includes(company._id);
                        const actionLabel = alreadyApplied
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
                                disabled={
                                    alreadyApplied || expired || !eligible
                                }
                                status={
                                    !student
                                        ? undefined
                                        : expired
                                            ? "Expired"
                                            : eligible
                                                ? "Eligible"
                                                : "Not eligible"
                                }
                            />
                        );
                    })}
                </div>
            </section>
        </main>
    );
}

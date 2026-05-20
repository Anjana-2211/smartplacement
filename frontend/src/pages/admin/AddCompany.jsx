import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function AddCompany() {
  const [company, setCompany] = useState({
    companyName: "",
    jobRole: "",
    ctc: "",
    minCGPA: "",
    eligibleBranches: "",
    registrationDeadline: "",
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const saveCompany = async () => {
    if (
      !company.companyName ||
      !company.jobRole ||
      !company.ctc ||
      company.minCGPA === "" ||
      !company.eligibleBranches ||
      !company.registrationDeadline
    ) {
      alert("Please fill out all fields before saving.");
      return;
    }

    setSaving(true);

    try {
      await API.post("/companies/add-company", {
        companyName: company.companyName,
        jobRole: company.jobRole,
        ctc: company.ctc,
        minCGPA: Number(company.minCGPA),
        eligibleBranches: company.eligibleBranches
          .split(",")
          .map((branch) => branch.trim())
          .filter(Boolean),
        registrationDeadline: company.registrationDeadline,
      });

      alert("Company added successfully.");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Failed to add company. Please check the data and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="form-section">
        <h1>Add Company</h1>
        <p>Create a new placement drive with company details and eligibility criteria.</p>
      </section>

      <section className="form-grid">
        <input
          className="form-input"
          placeholder="Company Name"
          value={company.companyName}
          onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
        />

        <input
          className="form-input"
          placeholder="Job Role"
          value={company.jobRole}
          onChange={(e) => setCompany({ ...company, jobRole: e.target.value })}
        />

        <input
          className="form-input"
          placeholder="CTC"
          value={company.ctc}
          onChange={(e) => setCompany({ ...company, ctc: e.target.value })}
        />

        <input
          className="form-input"
          type="number"
          min="0"
          max="10"
          step="0.01"
          placeholder="Min CGPA"
          value={company.minCGPA}
          onChange={(e) => setCompany({ ...company, minCGPA: e.target.value })}
        />

        <input
          className="form-input"
          placeholder="Branches (comma separated)"
          value={company.eligibleBranches}
          onChange={(e) => setCompany({ ...company, eligibleBranches: e.target.value })}
        />

        <input
          className="form-input"
          type="date"
          placeholder="Deadline"
          value={company.registrationDeadline}
          onChange={(e) => setCompany({ ...company, registrationDeadline: e.target.value })}
        />

        <button className="btn" onClick={saveCompany} disabled={saving}>
          {saving ? "Saving..." : "Create Company"}
        </button>
      </section>
    </main>
  );
}

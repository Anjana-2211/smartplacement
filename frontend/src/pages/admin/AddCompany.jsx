import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

const AVAILABLE_BRANCHES = ["CSE", "CSE-AI", "IT", "ECE", "EEE", "MECH", "CIVIL"];

export default function AddCompany() {
  const [company, setCompany] = useState({
    companyName: "",
    jobRole: "",
    ctc: "",
    minCGPA: "",
    selectedBranches: [],
    registrationDeadline: "",
    maxBacklogs: "",
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleBranchChange = (branch) => {
    let updatedBranches = [...company.selectedBranches];
    if (branch === "ALL") {
      updatedBranches = updatedBranches.length === AVAILABLE_BRANCHES.length ? [] : AVAILABLE_BRANCHES;
    } else {
      if (updatedBranches.includes(branch)) {
        updatedBranches = updatedBranches.filter((b) => b !== branch);
      } else {
        updatedBranches.push(branch);
      }
    }
    setCompany({ ...company, selectedBranches: updatedBranches });
  };

  const saveCompany = async () => {
    if (
      !company.companyName ||
      !company.jobRole ||
      !company.ctc ||
      company.minCGPA === "" ||
      company.selectedBranches.length === 0 ||
      !company.registrationDeadline
    ) {
      alert("Please fill out all fields and select at least one branch.");
      return;
    }

    setSaving(true);

    try {
      await API.post("/companies/add-company", {
        companyName: company.companyName,
        jobRole: company.jobRole,
        ctc: company.ctc,
        minCGPA: Number(company.minCGPA),
        eligibleBranches: company.selectedBranches,
        maxBacklogs: company.maxBacklogs ? Number(company.maxBacklogs) : 0,
        registrationDeadline: company.registrationDeadline,
      });

      alert(`Company ${company.companyName} added successfully.`);
      navigate("/");
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
          type="number"
          min="0"
          placeholder="Max Backlogs (optional)"
          value={company.maxBacklogs}
          onChange={(e) => setCompany({ ...company, maxBacklogs: e.target.value })}
        />

        <input
          className="form-input"
          type="date"
          placeholder="Registration Deadline"
          value={company.registrationDeadline}
          onChange={(e) => setCompany({ ...company, registrationDeadline: e.target.value })}
        />
      </section>

      <section className="form-section">
        <h2>Select Eligible Branches</h2>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={company.selectedBranches.length === AVAILABLE_BRANCHES.length}
              onChange={() => handleBranchChange("ALL")}
            />
            <span className="checkbox-text">All Branches</span>
          </label>
          {AVAILABLE_BRANCHES.map((branch) => (
            <label key={branch} className="checkbox-label">
              <input
                type="checkbox"
                checked={company.selectedBranches.includes(branch)}
                onChange={() => handleBranchChange(branch)}
              />
              <span className="checkbox-text">{branch}</span>
            </label>
          ))}
        </div>
        {company.selectedBranches.length > 0 && (
          <p style={{ marginTop: "12px", fontSize: "0.95rem", color: "var(--text)" }}>
            <strong>Selected:</strong> {company.selectedBranches.join(", ")}
          </p>
        )}
      </section>

      <section className="form-section">
        <button className="btn" onClick={saveCompany} disabled={saving}>
          {saving ? "Saving..." : "Create Company"}
        </button>
      </section>
    </main>
  );
}

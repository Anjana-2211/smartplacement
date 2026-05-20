export default function CompanyCard({
    company,
    actionLabel,
    onAction,
    disabled,
    status
}) {

    const formatDate = (value) => {
        if (!value) return "";
        return new Date(value).toLocaleDateString();
    };

    return (

        <div className="company-card">

            <div className="company-card__header">
                <div>
                    <h2>{company.companyName}</h2>
                    <p className="small-text">{company.jobRole}</p>
                </div>
                {status && (
                    <span className={`status-pill status-${status.replace(/\s+/g, "").toLowerCase()}`}>
                        {status}
                    </span>
                )}
            </div>

            <div className="company-detail">
                <p><strong>Package:</strong> {company.ctc || company.package}</p>
                <p><strong>CGPA Min:</strong> {company.minCGPA}</p>
                <p><strong>Branches:</strong> {company.eligibleBranches?.join(", ")}</p>
                <p><strong>Backlogs Allowed:</strong> {company.maxBacklogs ?? 0}</p>
                <p><strong>Registration Deadline:</strong> {formatDate(company.registrationDeadline)}</p>
            </div>

            {company.interviewDates?.length > 0 && (
                <div className="company-detail">
                    <p><strong>Interview Schedule:</strong></p>
                    <ul>
                        {company.interviewDates.map((item, index) => (
                            <li key={index}>{item.stage}: {formatDate(item.date)}</li>
                        ))}
                    </ul>
                </div>
            )}

            {actionLabel && (
                <button
                    className="btn"
                    onClick={onAction}
                    disabled={disabled}
                >
                    {actionLabel}
                </button>
            )}

        </div>
    );
}

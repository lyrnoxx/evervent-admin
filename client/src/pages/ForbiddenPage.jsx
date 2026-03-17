import { Link } from "react-router-dom";

const ForbiddenPage = () => {
  return (
    <section className="auth-card">
      <h2>Forbidden</h2>
      <p>You do not have permission to access this resource.</p>
      <Link to="/dashboard">Go back to dashboard</Link>
    </section>
  );
};

export default ForbiddenPage;

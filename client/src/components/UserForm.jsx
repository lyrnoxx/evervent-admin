import { useState } from "react";

const initialState = {
  name: "",
  email: "",
  password: "",
  role: "User",
};

const UserForm = ({ onSubmit, loading, initialValues, showRole = true, submitText = "Save" }) => {
  const [formData, setFormData] = useState({
    ...initialState,
    ...initialValues,
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...formData };

    if (!payload.password) {
      delete payload.password;
    }

    await onSubmit(payload);

    if (!initialValues) {
      setFormData(initialState);
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h3>{submitText}</h3>
      <label>
        Name
        <input name="name" value={formData.name} onChange={handleChange} required />
      </label>

      <label>
        Email
        <input name="email" type="email" value={formData.email} onChange={handleChange} required />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={initialValues ? "Leave blank to keep current" : "Enter password"}
        />
      </label>

      {showRole && (
        <label>
          Role
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </label>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : submitText}
      </button>
    </form>
  );
};

export default UserForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../service/api";

function LoginAsAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    const res = await fetch(`${URL}/users`);
    const users = await res.json();
    const admin = users.find(
      (u) => u.email === email && u.password === password && u.role === "admin"
    );

    if (admin) {
      localStorage.setItem("admin", JSON.stringify(admin));
      navigate("/admin/dashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto mt-20 border shadow">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      <input
        className="border p-2 w-full mb-3"
        placeholder="Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-full mb-3"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAdminLogin} className="bg-red-500 text-white p-2 w-full rounded">
        Login
      </button>
    </div>
  );
}

export default LoginAsAdmin;

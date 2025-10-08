import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile", { credentials: "include" });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to fetch user: ${res.status}`);
      }

      const data = await res.json();
      setUser({
        name: data.Name,
        email: data.Email,
      });
      setError(null);
    } catch (err) {
      console.error("Error in fetching Profile:", err);
      setError(err.message || "Something went wrong");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Runs once on app load
  useEffect(() => {
    fetchProfile();
  }, []);

  // expose a manual refresh function
  const refreshUser = () => fetchProfile();

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

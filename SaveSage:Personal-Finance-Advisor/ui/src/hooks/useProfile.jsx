import { useState, useEffect } from "react";

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });

        if (!res.ok) {
          throw new Error(`Failed to fetch profile: ${res.status}`);
        }

        const data = await res.json();
        setProfile({
          name: data.Name,
          email: data.Email
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message || "Something went wrong");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error, setProfile };
}

const API_URL = "http://127.0.0.1:3001/api/candidates";

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
};

export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Update failed");
  return res.json();
};

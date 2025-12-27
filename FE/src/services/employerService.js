const API_URL = "http://127.0.0.1:3001/api/employers";

export const getEmployerProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to load employer profile");
  return res.json();
};

export const updateEmployerProfile = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Update employer profile failed");
  return res.json();
};

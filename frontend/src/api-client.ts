import type {formDataRegister} from "./pages/Register";

const API_BASE_URL = "http://localhost:7000/api";

export const registerUser = async (data: formDataRegister) => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers : {
        "Content-Type": "application/json",     
    },
    credentials: "include",
    body: JSON.stringify(data)
  });
  const responseBody = await response.json();    
  if (!response.ok) {
    throw new Error(responseBody.message || "Registration failed");
  }
};
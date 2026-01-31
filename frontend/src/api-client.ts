import type { formDataRegister } from "./pages/Register";
import type { SignInFormData } from "./pages/Signin";

const API_BASE_URL = "";

export const registerUser = async (data: formDataRegister) => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message || "Registration failed");
  }
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
    method: "GET",
    credentials: "include",
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message || "Token validation failed");
  }
  return responseBody;
};

export const login = async (data: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    credentials: "include",
    method: "POST",
  });
  if(!response.ok) {
    throw new Error("Error during signout");
  }
};

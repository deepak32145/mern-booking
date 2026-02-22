import type { HotelSearchResponse, HotelType } from "../../backend/src/models/hotel";
import type { formDataRegister } from "./pages/Register";
import type { SignInFormData } from "./pages/Signin";

const API_BASE_URL = "http://localhost:7000";

export const registerUser = async (data: formDataRegister) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
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
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
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
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Error during signout");
  }
};

export const addHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
    method: "POST",
    body: hotelFormData,
  });
  if (!response.ok) {
    throw new Error("Error during create");
  }
  return response.json();
};

export const fetchMyHotels = async () => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("something went wrong");
  }
  return response.json();
};

export const fetchHoteLById = async (hotelId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("failed to fetch hotel details");
  }
  return response.json();
};

export const editHotel = async (hotelFormData: FormData) => {
  const hotelId = hotelFormData.get("hotelId") as string;
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: "include",
    method: "PUT",
    body: hotelFormData,
  });
  if (!response.ok) {
    throw new Error("Failed to update hotel");
  }
  return response.json();
};

export type searchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export const searchHotels = async (
  searchParams: searchParams,
): Promise<HotelSearchResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || "");
  queryParams.append("childCount", searchParams.childCount || "");
  queryParams.append("page", searchParams.page || "");

  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOption", searchParams.sortOption || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility),
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));

  const response = await fetch(
    `${API_BASE_URL}/api/search-hotel/search?${queryParams}`,
  );

  if (!response.ok) {
    throw new Error("Error in fetching data");
  }
  return response.json();
};

export const getHotelById = async (hotelId: string) : Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/search-hotel/${hotelId}`);
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};

export const getUserInfo = async() =>{
  const response = await fetch(`${API_BASE_URL}/api/users/me` , {
    credentials : "include"
  });
  if(!response.ok) {
    throw new Error("something went wrong")
  }
  return response.json();
}

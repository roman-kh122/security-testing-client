import { jwtDecode } from "jwt-decode";

export const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    const userData = {
      userName:
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      userId:
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ],
      role: decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ],
    };

    return userData;
  }
  return null;
};
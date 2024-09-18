
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import apiClient from "../src/apiClient";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await apiClient.get("/profile");// Replace with the correct endpoint
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null); // Reset user state if there's an error
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

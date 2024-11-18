"use client";

import { useState, useEffect, createContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/cars", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCars(data);
          console.log("User data fetched:", data);
        } else {
          console.error("Failed to fetch cars");
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <UserContext.Provider value={{ cars, setCars }}>
      {children}
    </UserContext.Provider>
  );
};

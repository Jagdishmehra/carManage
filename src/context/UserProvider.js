"use client";
import { useState, useEffect, createContext, useCallback } from "react";
import { toast } from "react-toastify";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/cars", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCars(data);
        console.log("Cars fetched:", data);
      } else {
        console.error("Failed to fetch cars");
        toast.error("Failed to fetch cars");
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Method to add a new car
  const addCar = useCallback((newCar) => {
    setCars((prevCars) => [newCar, ...prevCars]);
  }, []);

  // Method to remove a car
  const removeCar = useCallback((carId) => {
    setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
  }, []);

  // Method to update a car
  const updateCar = useCallback((updatedCar) => {
    setCars((prevCars) =>
      prevCars.map((car) => (car._id === updatedCar._id ? updatedCar : car))
    );
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        cars,
        setCars,
        fetchData,
        addCar,
        removeCar,
        updateCar,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

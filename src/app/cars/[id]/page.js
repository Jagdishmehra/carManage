"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";

export default function CarDetail() {
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isEditing, setIsEditing] = useState(false); // New state variable
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchCar = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        console.log("this is car indi data ", data);
        setCar(data.car);
        setTitle(data.car.title);
        setDescription(data.car.description);
        setTags(data.car.tags.join(", ")); // Join tags for input
      } else {
        toast.error("Failed to fetch car details");
      }
      setLoading(false);
    };

    fetchCar();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/cars/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      toast.success("Car deleted successfully");
      router.replace("/cars");
    } else {
      toast.error("Failed to delete car");
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/cars/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        tags: tags.split(",").map((tag) => tag.trim()),
        images: car.images, // Keep the existing images
      }),
    });

    if (res.ok) {
      toast.success("Car updated successfully");
      setIsEditing(false); // Exit edit mode after saving
      router.reload(); // Reload the page to reflect changes
    } else {
      toast.error("Failed to update car");
    }
  };
  console.log("this is car :", car.images);
  // Carousel functions
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + car.images.length) % car.images.length
    );
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      {car?.images?.length > 0 && (
        <div className="relative w-full mt-10 mb-[20%]">
          <img
            src={car.images[currentImageIndex]}
            alt="Car Image"
            className="w-[50%] ml-[20%] h-auto text-black rounded shadow-md"
          />
          <div className="mt-10 flex justify-between">
            <button
              onClick={prevImage}
              className="bg-gray-800 text-white p-2 rounded"
            >
              Prev
            </button>
            <button
              onClick={nextImage}
              className=" bg-gray-800 text-white p-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {/* Editable Car Title, Description, and Tags */}
      <div className="text-md text-gray-600 mb-4">
        <strong className="focus:outline-none ">Title: </strong>
        <input
          type="text"
          className="text-xl font-semibold focus:outline-none  text-black mb-4 w-full  rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          readOnly={!isEditing} // Make it read-only if not editing
        />
      </div>

      <div className="text-md text-gray-600 mb-4">
        <strong className="focus:outline-none ">Description: </strong>
        <textarea
          className="text-md mb-2 w-full focus:outline-none  text-black rounded p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          readOnly={!isEditing} // Make it read-only if not editing
        />
      </div>

      <div className="text-md text-gray-600 mb-4">
        <strong className="focus:outline-none flex ">Tags: </strong>
        <input
          type="text"
          className="text-black focus:outline-none  rounded p-2"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          readOnly={!isEditing} // Make it read-only if not editing
        />
      </div>

      {/* Image Carousel */}

      {/* Edit and Save Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setIsEditing(!isEditing)} // Toggle edit mode
          className={`${
            isEditing ? "bg-red-500" : "bg-blue-500"
          } text-white px-4 py-2 rounded`}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
        {isEditing && (
          <button
            onClick={handleUpdate}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        )}
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

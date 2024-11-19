"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { UserContext } from "@/context/UserProvider";

// Shimmer Component
const ShimmerLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="relative w-64 h-64 bg-gray-200 rounded-lg overflow-hidden">
        <div className="absolute inset-0 shimmer-loader">
          <div className="shimmer-line"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-500 animate-pulse"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
          <p className="mt-4 text-gray-600 animate-pulse">Adding Car...</p>
        </div>
      </div>
    </div>
  );
};

export default function CreateCar() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { addCar } = useContext(UserContext);

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    // Start submission process
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "tags",
      JSON.stringify(tags.split(",").map((tag) => tag.trim()))
    );

    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file);
      });
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const car = await res.json();

        // Add car to context immediately
        addCar(car);

        toast.success("Car added successfully!");
        router.replace("/cars"); // Use replace to prevent going back
      } else {
        const errorText = await res.text();
        toast.error(`Error: ${errorText}`);
        // Stop submission process on error
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error during car creation:", error);
      toast.error("An error occurred. Please try again.");
      // Stop submission process on error
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e) => {
    const filesArray = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...filesArray]);
    const previewURLs = filesArray.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...previewURLs]);
  };

  // Add global styles for shimmer effect
  const ShimmerStyles = () => (
    <style jsx global>{`
      .shimmer-loader {
        position: relative;
        overflow: hidden;
      }
      .shimmer-line {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.5),
          transparent
        );
        animation: shimmer 1.5s infinite;
      }
      @keyframes shimmer {
        100% {
          left: 100%;
        }
      }
    `}</style>
  );

  return (
    <>
      {/* Shimmer Loader */}
      {isSubmitting && <ShimmerLoader />}
      <ShimmerStyles />

      <div className="min-h-screen p-4 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-black">Add Car</h1>
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-2 p-2 border border-gray-400 text-black rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <textarea
          placeholder="Description"
          className="w-full mb-2 p-2 border border-gray-400 text-black rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        ></textarea>
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          className="w-full mb-2 p-2 border border-gray-400 text-black rounded"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={isSubmitting}
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="mb-4"
          disabled={isSubmitting}
        />
        <div className="grid grid-cols-3 gap-2 mt-2">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Preview ${idx + 1}`}
              className="w-full h-32 object-cover rounded"
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className={`
            ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } 
            text-white p-2 rounded mt-4 transition-colors duration-300
          `}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </>
  );
}

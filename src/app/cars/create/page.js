"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateCar() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const router = useRouter();

  const handleSubmit = async () => {
    if (images.length > 10) {
      toast.error("You can upload up to 10 images only");
      return;
    }

    const token = localStorage.getItem("token");
    const res = await fetch("/api/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        tags: tags.split(",").map((tag) => tag.trim()),
        images,
      }),
    });

    if (res.ok) {
      toast.success("Car added successfully!");
      router.push("/cars");
    } else {
      toast.error("Error adding car");
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const filePaths = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...filePaths]);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-black">Add car</h1>
      <input
        type="text"
        placeholder="Title"
        className="w-full mb-2 p-2 border border-gray-400 text-black rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="w-full mb-2 p-2 border border-gray-400 text-black rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        className="w-full mb-2 p-2 border border-gray-400 text-black rounded"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
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
        className="bg-green-500 text-white p-2 rounded mt-4"
      >
        Submit
      </button>
    </div>
  );
}

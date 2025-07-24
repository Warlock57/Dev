import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetCarDetails } from "../features/car/carDetailsSlice";
import { resetCarState } from "../features/car/carSlice";
import { createCar, resetCarCreate } from "../features/car/carCreateSlice";
import { FaUpload } from "react-icons/fa";
import Alert from "../components/Alert";

const CreateCars = () => {
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success } = useSelector((state) => state.carCreate);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    pricePerDay: "",
    deposit: "",
    mileage: "",
    type: "",
    gearType: "",
    yearModel: "",
    seatCapacity: "",
    fuelType: "",
    images: [],
  });

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("uploadedImages")) || [];
    setFormData((prev) => ({ ...prev, images: storedImages }));
  }, []);

  useEffect(() => {
    if (success) {
      dispatch(resetCarCreate());
      dispatch(resetCarState());
      dispatch(resetCarDetails());
      localStorage.removeItem("uploadedImages");
      navigate("/admin/cars");
    }
  }, [dispatch, success, navigate]);

  useEffect(() => {
    setError(false);
    setMessage("");
  }, [files]);

  const dropdownOptions = {
    type: ["SUV", "Sedan", "Hatchback"],
    gearType: ["Manual", "Automatic"],
    fuelType: ["Petrol", "Diesel", "Electric", "Hybrid"],
  };

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const uploadFileHandler = async () => {
    if (files.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    const uploadFormData = new FormData();
    files.forEach((file) => uploadFormData.append("files", file)); // match backend key

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Upload Response:", data);

      if (data && data.files) {
        localStorage.setItem("uploadedImages", JSON.stringify(data.files));
        setFormData((prev) => ({ ...prev, images: data.files }));
        setMessage("Images uploaded successfully!");
        setError(false);
      } else {
        throw new Error("No files returned from server.");
      }
    } catch (error) {
      console.error("Upload Error:", error.message);
      setError(true);
      setMessage(error.message || "Image upload failed.");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const storedFiles = JSON.parse(localStorage.getItem("uploadedImages")) || [];

    if (storedFiles.length > 0) {
      const finalData = { ...formData, images: storedFiles };
      console.log("🟢 Final Form Data:", finalData);
      dispatch(createCar(finalData));
    } else {
      alert("Please upload images before submitting.");
    }
  };

  return (
    <form className="form-control w-[300px] mx-auto mb-20" onSubmit={submitHandler}>
      {Object.keys(formData).map(
        (key) =>
          key !== "images" && (
            <div key={key}>
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              {dropdownOptions[key] ? (
                <select
                  name={key}
                  value={formData[key]}
                  onChange={onChange}
                  className="select select-bordered w-full mb-6"
                >
                  <option value="">Select {key}</option>
                  {dropdownOptions[key].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={
                    key.includes("price") ||
                    key.includes("deposit") ||
                    key.includes("mileage") ||
                    key.includes("seat") ||
                    key.includes("year")
                      ? "number"
                      : "text"
                  }
                  name={key}
                  value={formData[key]}
                  onChange={onChange}
                  className="input input-bordered w-full mb-6"
                />
              )}
            </div>
          )
      )}

      <label htmlFor="images">Images</label>
      <input
        type="file"
        name="images"
        accept="image/*"
        onChange={(e) => setFiles(Array.from(e.target.files))}
        multiple
        className="file-input file-input-bordered file-input-accent w-full max-w-xs"
      />

      <div className="mt-2 flex flex-col space-y-2 items-center">
        {error && <Alert variant="alert-error" message={message} />}
        <button
          type="button"
          onClick={uploadFileHandler}
          className={`flex gap-2 items-center btn-sm rounded-lg ${
            files.length === 0 || error ? "btn-disabled" : "btn-accent"
          }`}
          disabled={files.length === 0}
        >
          Upload images <FaUpload />
        </button>
      </div>

      <button
        className={`btn mt-6 ${formData.images.length > 0 ? "" : "btn-disabled"}`}
        disabled={formData.images.length === 0}
      >
        Send
      </button>
    </form>
  );
};

export default CreateCars;

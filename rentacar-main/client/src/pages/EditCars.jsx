import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { resetCarDetails, getCarbyId } from '../features/car/carDetailsSlice'
import { resetCarState } from '../features/car/carSlice'
import { resetCarUpdate, updateCar } from '../features/car/carUpdateSlice'
import { FaUpload } from 'react-icons/fa'
import Alert from '../components/Alert'

const EditCars = () => {
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState([])

  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const carId = params.id

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    pricePerDay: '',
    deposit: '',
    mileage: '',
    type: '',
    gearType: '',
    yearModel: '',
    seatCapacity: '',
    fuelType: '',
    images: [],
  })

  const { success } = useSelector((state) => state.carUpdate)
  const { car } = useSelector((state) => state.carDetails)

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem('uploadedImages')) || []
    setFormData((prev) => ({ ...prev, images: storedImages }))
  }, [])

  useEffect(() => {
    if (success) {
      dispatch(resetCarUpdate())
      dispatch(resetCarState())
      dispatch(resetCarDetails())
      localStorage.removeItem('uploadedImages')
      navigate('/admin/cars')
    } else {
      if (!car || car._id !== carId) {
        dispatch(getCarbyId(carId))
      } else {
        setFormData({
          name: car.name || '',
          brand: car.brand || '',
          pricePerDay: car.pricePerDay || '',
          deposit: car.deposit || '',
          mileage: car.mileage || '',
          type: car.type || '',
          gearType: car.gearType || '',
          yearModel: car.yearModel || '',
          seatCapacity: car.seatCapacity || '',
          fuelType: car.fuelType || '',
          images: car.images || [],
        })
      }
    }
  }, [dispatch, car, carId, success, navigate])

  const dropdownOptions = {
    type: ['SUV', 'Sedan', 'Hatchback'],
    gearType: ['Manual', 'Automatic'],
    fuelType: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
  }

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

const uploadFileHandler = async () => {
  if (files.length === 0) {
    alert('Please select at least one image.');
    return;
  }

  const formData = new FormData();
  files.forEach((file) => formData.append('files', file)); // Match backend field name

  try {
    console.log('Uploading Files:', files); // Debugging log

    const res = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Failed to upload files: ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Upload Response:', data); // Debugging log

    if (data && data.files) {
      localStorage.setItem('uploadedImages', JSON.stringify(data.files));
      setFormData((prev) => ({ ...prev, images: data.files }));
      setMessage('Images uploaded successfully!');
      setError(false);
    } else {
      throw new Error('Upload failed: No files returned from server');
    }
  } catch (error) {
    console.error('Upload Error:', error.message);
    setError(true);
    setMessage(error.message || 'Image upload failed');
  }
};



const submitHandler = (e) => {
  e.preventDefault();
  

  const storedFiles = JSON.parse(localStorage.getItem('uploadedImages')) || [];

  if (storedFiles.length > 0) {
    const updatedData = { ...formData, images: storedFiles };
    dispatch(updateCar({ id: carId, ...updatedData }));
  } else {
    alert('Please upload images before submitting.');
  }
};


  return (
    <form className="form-control w-[300px] mx-auto mb-20" onSubmit={submitHandler}>
      {Object.keys(formData).map(
        (key) =>
          key !== 'images' && (
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
                    key.includes('price') ||
                    key.includes('deposit') ||
                    key.includes('mileage') ||
                    key.includes('seat') ||
                    key.includes('year')
                      ? 'number'
                      : 'text'
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
            files.length === 0 || error ? 'btn-disabled' : 'btn-accent'
          }`}
          disabled={files.length === 0}
        >
          Upload images <FaUpload />
        </button>
      </div>

      <button
        className={`btn mt-6 ${formData.images.length > 0 ? '' : 'btn-disabled'}`}
        disabled={formData.images.length === 0}
      >
        Send
      </button>
    </form>
  )
}

export default EditCars

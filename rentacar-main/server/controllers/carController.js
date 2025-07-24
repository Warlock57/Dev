import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import Car from '../models/carModel.js';

const getCars = async (req, res) => {
  const rangeValue = +req.query.rangeValue || 0;
  const pageNumber = +req.query.pageNumber || 1;
  const carLimit = 6;
  try {
    const cars = await Car.find({})
      .limit(carLimit)
      .where('pricePerDay')
      .skip(carLimit * (pageNumber - 1))
      .gte(rangeValue);

    const carCount = await Car.countDocuments();

    res.status(200).json({
      cars,
      page: pageNumber,
      pages: Math.ceil(carCount / carLimit),
    });
  } catch (error) {
    res.status(500).json({
      errorMsg: 'Something went wrong',
      message: error.message,
    });
  }
};

const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)

    if (car) {
      res.status(200).json(car)
    } else {
      res.status(404).json({ message: 'Car not found' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Admin: Get all cars
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({});
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

// Admin: Delete car by ID (also deletes images from local storage)
const deleteCarById = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // Delete images from local storage
    car.images.forEach((imagePath) => {
      const fullPath = path.resolve(`.${imagePath}`);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // Delete file
      }
    });

    await car.deleteOne();
    res.status(200).json({ success: true, message: "Car deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Admin: Update car details
const updateCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      pricePerDay,
      deposit,
      mileage,
      type,
      gearType,
      yearModel,
      seatCapacity,
      fuelType,
      images,
    } = req.body;

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    // Replace images if new ones are uploaded
    if (images && images.length > 0) {
      // Delete old images
      car.images.forEach((imagePath) => {
        const fullPath = path.resolve(`.${imagePath}`);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });

      car.images = images;
    }

    // Update other fields
    car.name = name ?? car.name;
    car.brand = brand ?? car.brand;
    car.pricePerDay = pricePerDay ?? car.pricePerDay;
    car.deposit = deposit ?? car.deposit;
    car.mileage = mileage ?? car.mileage;
    car.type = type ?? car.type;
    car.gearType = gearType ?? car.gearType;
    car.yearModel = yearModel ?? car.yearModel;
    car.seatCapacity = seatCapacity ?? car.seatCapacity;
    car.fuelType = fuelType ?? car.fuelType;

    const updatedCar = await car.save();
    return res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      car: updatedCar,
    });
  } catch (error) {
    console.error('Update Car Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating car',
    });
  }
};

// Admin: Create a new car
const createCar = async (req, res) => {
  try {
    const {
      name, brand, pricePerDay, deposit, mileage,
      type, gearType, yearModel, seatCapacity, fuelType, images,
    } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ success: false, message: "No images provided" });
    }

    const car = new Car({
      user: req.user._id,
      name, brand, pricePerDay, deposit, mileage,
      type, gearType, yearModel, seatCapacity, fuelType,
      images, // Local image paths
    });

    const createdCar = await car.save();
    res.status(201).json(createdCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export {
  getCars,
  getCarById,
  getAllCars,
  deleteCarById,
  updateCarById,
  createCar,
};

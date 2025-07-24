import multer from 'multer'
import path from 'path'

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/licenses/') // Folder where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`) // Unique filename
  },
})

// File filter for license files (optional)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only PDF and image files are allowed'), false)
  }
}


const carstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cars/') // Folder where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`) // Unique filename
  },
})

// File filter for license files (optional)
const CarfileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only PDF and image files are allowed'), false)
  }
}




const carupload = multer({ carstorage, CarfileFilter })

const upload = multer({ storage, fileFilter })


export { upload, carupload } // Export the upload instance
const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../model/campground");
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const campgrounds = require('../controllers/campgrounds.js');
const multer = require('multer');
const {storage} = require('../cloudinary/index.js');
const { trace } = require('joi');
const upload = multer({ storage })

//GET request    to get all the campgrounds
router.get(
    "/",
    catchAsync(campgrounds.index)
);

//GET request to get the form to create new campground
router.get(
    "/new",
    isLoggedIn,
    catchAsync(campgrounds.renderNewForm)
);

//GET request to get specific details of a campground
router.get(
    "/:id",
    catchAsync(campgrounds.showCampground)
);

//POST request to create the new campground
router.post(
    "/",
    isLoggedIn,
    upload.array('images'),
    validateCampground,
    catchAsync(campgrounds.createCampground)
);
// router.post('/', , (req, res) => { 
//     try {
//         console.log(req.body);
//         // console.log(req.files);
//         res.send(req.files)
//     } catch (error) {
//         req.flash('error',error.message);
//         res.redirect('/campgrounds');
//     }
//  });

//GET Request to get the form to edit campground
router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.renderEditForm)
);

//PUT Request to edit the submitted campground
router.put(
    "/:id",
    isLoggedIn,
    isAuthor,
    upload.array('images'),
    validateCampground,
    catchAsync(campgrounds.editCampground)
);

//DELETE Request to delete the campground
router.delete(
    "/:id/delete",
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
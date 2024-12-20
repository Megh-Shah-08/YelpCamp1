const { model } = require("mongoose");
const Campground = require("../model/campground");
const {cloudinary} = require('../cloudinary');
const maptilerClient =  require('@maptiler/client');
maptilerClient.config.apiKey = process.env.MAPTILER_KEY
//INDEX ROUTE
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}

//render the new form
module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new.ejs");
};

//show specific campground
module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews', populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', "Cannot found the campground!");
        return res.redirect('/campgrounds')
    }
    
    res.render("campgrounds/show", { campground });
};


//create the new campground
module.exports.createCampground = async (req, res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location,{limit:1});
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    const newCampground = await campground.save();
    console.log(newCampground);
    req.flash('success', 'Succesfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
};

//render the edit form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', "Cannot found the campground!");
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit", { campground });
};

//edit the campground
module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const { title, location, price, description } = req.body.campground;
    const { deleteImages } = req.body;
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location,{limit:1});
    const campground = await Campground.findByIdAndUpdate(id, {
        title,
        location,
        price,
        description,
    });
    campground.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (deleteImages) {
        for(let filename of deleteImages){
            await cloudinary.uploader.destroy(filename);
        }   
        const campgroundUpdate = await campground.updateOne({ $pull: { images: { filename: { $in: deleteImages } } } })
    }
    console.log(campground);
    req.flash('success', 'Succesfully edited the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

//delete the campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findByIdAndDelete(id);
    if (!campground) {
        req.flash('error', "Cannot found the campground!");
        return res.redirect('/campgrounds')
    }
    req.flash('success', 'Succesfully deleted the campground!');
    res.redirect("/campgrounds");
};


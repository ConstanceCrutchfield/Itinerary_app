const mongoose = require('mongoose');
const mLAB_URI = require('../config').mLAB_URI;

mongoose.connect(mLAB_URI, { useNewUrlParser: true });

const userProfileSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordConf: {
        type: String,
        required: true,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: null },
    interests: {
        cocktails: { type: Boolean, lowercase: true, },
        pizza: { type: Boolean, lowercase: true, },
        outdors: { type: Boolean, lowercase: true, },
        jazz: { type: Boolean, lowercase: true, },
        festivals: { type: Boolean, lowercase: true, },
        shopping: { type: Boolean, lowercase: true, },
    },
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

// save a user profile to database
// accepts object with user's properties
// creates new profile and saves to database
const createUserProfile = (userObj, cb) => {
    // check for unique username and email
    // alert user if either is already taken
    const newUser = new UserProfile({
        username: userObj.username,
        email: userObj.email,
        password: userObj.password,
        passwordConf: userObj.passwordConf,
        interests: {
            cocktails: false,
            pizza: false,
            outdoors: false,
            jazz: false,
            festivals: false,
            shopping: false,
        },
    });
    // save new profile 
    newUser.save((error) => {
        if (error) { 
            console.error(error, 'error saving new profile'); 
            cb(error);
        }
    });

};

// update interests function
// accepts username and interest to be updated
// changes boolean value of interest on user profile
const updateInterests = (updateObj, cb) => {
    // update time
    let query = { username: updateObj.username };
    let setObject = {};
    // update interest
    setObject["interests." + updateObj.interest] = true;
    // update timestamp
    setObject["updated_at"] = Date.now();

    UserProfile.updateOne(query, {$set: setObject},(err) => {
        if (err) {
            console.error(err);
            cb(err, 'error updating interest');
        } else {
            // profile.updated_at = Date.now();
            // let prop = Object.keys(setObject)[0];
            // console.log(Object.keys(profile.interests), 'bool');
            // profile[Object.keys(setObject)[0]] = !profile[Object.keys(setObject)[0]];
            // profile.save((err) => {
            //     if (err) {
            //         console.error(err, 'error saving updated interest');
            //         cb(err);
            //     }
            // })
        }
    });
};

// update profile function
// accepts username and object with property and value to be updated
// changes value of property on user profile
const updateProfile = (username, propObj, cb) => {
    let query = { username };
    UserProfile.updateOne(query, propObj, (err) => {
        if (err) {
            console.error(err);
            cb(err, 'error updating interest');
        } 
    });
};

const getUserInterests = (username, cb) => {
    let interests = [];
    UserProfile.findOne({ username })
        .exec((err, profile) => {
            if (err) {
                console.error(err, 'error getting user interests');
                cb(err);
            } else {
                Object.keys(profile.interests)
                    .forEach((key) => {
                        if(profile.interests[key] === true) {
                            if (key !== '$init') {
                                interests.push(key);
                            }
                        }
                    });
            }
            cb(null, interests);
        });
};


module.exports.UserProfile = UserProfile;
module.exports.createUserProfile = createUserProfile;
module.exports.updateInterests = updateInterests;
module.exports.updateProfile = updateProfile;
module.exports.getUserInterests = getUserInterests;

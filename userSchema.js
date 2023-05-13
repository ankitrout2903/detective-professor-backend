const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  clue1Time: {
    type: Number,
    default: 0,
  },
  clue2Time: {
    type: Number,
    default: 0,
  },
  clue3Time: {
    type: Number,
    default: 0,
  },
  clue4Time: {
    type: Number,
    default: 0,
  },
  clue5Time: {
    type: Number,
    default: 0,
  },
  totalTime: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
    token : {
      type: String,
      required: true,
    unique: true,
    }
  
});

// Hash the password before saving
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const saltRounds = 10;
  bcrypt.hash(this.password, saltRounds, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

// Define the comparePassword method
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// generting token//
userSchema.methods.generateAuthToken = async function () {
try{
  let token = jwt.sign({_id:this._id},FLIGHTLIEUTENANTANKITROUTCALLSIGNGUSTYWINGMAN);
  this.tokens = this.tokens.concat({token:token});
  await this.save();
  return token;
}catch(error){
  console.log(error);
}
}
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

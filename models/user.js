const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.path('email').validate((val) => {
  const emailRegex = /(?!.*--)[a-zA-Z0-9][-.\w]*(?<!-)@[a-zA-Z0-9]+[-.\w]*(?<!-)\.[a-zA-Z]+$/;
  return emailRegex.test(val);
}, 'Неверный e-mail');

module.exports = mongoose.model('user', userSchema);

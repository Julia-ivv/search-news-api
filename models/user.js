const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new Error('Неправильная почта или пароль'));
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) return Promise.reject(new Error('Неправильная почта или пароль'));
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);

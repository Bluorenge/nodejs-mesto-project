import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import StatusCode from '../constants/status-codes';
import HttpError from '../errors/http-error';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string)
    => Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [200, 'Максимальная длина поля "about" - 200'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный формат email',
    },
  },
  password: {
    type: String,
    required: true,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  this: UserModel,
  email: string,
  password: string,
) {
  const user = await this.findOne({ email }).select('+password');

  if (!user) {
    throw new HttpError(
      'Неправильные почта или пароль',
      StatusCode.UNAUTHORIZED,
    );
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new HttpError(
      'Неправильные почта или пароль',
      StatusCode.UNAUTHORIZED,
    );
  }

  return user;
};

// Переопределяем метод toJSON для удаления пароля из ответа
userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model<IUser, UserModel>('user', userSchema);

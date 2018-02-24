import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
import * as mongoose from "mongoose";

export type UserModel = mongoose.Document & {
  email?: string;
  password?: string;
  num?: number;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  facebook?: string;
  tokens?: AuthToken[];

  profile?: {
    name: string;
    gender: string;
    location: string;
    website: string;
    picture: string;
  };

  comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;
  gravatar: (size: number) => string;
};

export type AuthToken = {
  accessToken: string;
  kind: string;
};

const homeSchema = new mongoose.Schema(
  {
    searchValue: String,
    profile: {
      searchValue: String
    }
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
homeSchema.pre("save", function save(next) {
  const user = this;
  // bcrypt.genSalt(10, (err, salt) => {
  //   if (err) { return next(err); }
  //   bcrypt.hash(user.searchValue, salt, undefined, (err: mongoose.Error, hash) => {
  //     if (err) { return next(err); }
  //     user.searchValue = hash;
  //     next();
  //   });
  // });
  next();
});

// homeSchema.methods.comparePassword = function (candidatePassword: string, cb: (err: any, isMatch: any) => {}) {
//   bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
//     cb(err, isMatch);
//   });
// };

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const Home = mongoose.model("Home", homeSchema);
export default Home;

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
    num: Number,
    passwordResetToken: String,
    passwordResetExpires: Date,

    facebook: String,
    twitter: String,
    google: String,
    tokens: Array,

    profile: {
      name: String,
      gender: String,
      location: String,
      website: String,
      picture: String
    }
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword: string, cb: (err: any, isMatch: any) => {}) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function(size: number) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto
    .createHash("md5")
    .update(this.email)
    .digest("hex");
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
// const Users = mongoose.model("Users", userSchema);
// export default { Users };

import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
import * as mongoose from "mongoose";

export type UserModel = mongoose.Document & {
  email?: string;
  password?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  num?: number;
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
  validPassword: (password: string, cb: (err: any, isMatch: any) => {}) => void;
  gravatar: (size: number) => string;
};

export type AuthToken = {
  accessToken: string;
  kind: string;
};

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

// userSchema.methods.validPassword = function(password: string, cb: (err: any, isMatch: any) => {}) {
//   bcrypt.compare(password, this.password);
// };
/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function(size: number) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return "邮箱不存在";
  }
  const md5 = crypto
    .createHash("md5")
    .update(this.email)
    .digest("hex");
  return "密码不正确";
};

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model("User", userSchema);
export default User;

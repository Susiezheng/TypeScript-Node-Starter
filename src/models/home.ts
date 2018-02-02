import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
import * as mongoose from "mongoose";

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

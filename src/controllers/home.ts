import { Request, Response, NextFunction } from "express";
import { default as Home, UserModel } from "../models/home";
import { default as User } from "../models/User";
import { IVerifyOptions } from "passport-local";
import * as passport from "passport";
import { ResFormat } from "../utils/tip";
import { IRes } from "resFormat";
import { WriteError } from "mongodb";

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  res.send({ name: "zsq" });
};

export let getSearch = (req: Request, res: Response) => {
  res.send({ name: "123" });
};

export let postSearch = (req: Request, res: Response, next: NextFunction) => {
  const errors = req.validationErrors();

  if (errors) {
    return res.send({ error: "失败" });
  }
  if (!req.body.searchValue) {
    return res.send({ error: "请输入参数" });
  }

  const home = new Home({
    searchValue: req.body.searchValue
  });

  Home.findOne({ searchValue: req.body.searchValue }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    home.save(err => {
      if (err) {
        return next(err);
      } else {
        const data = {
          code: 0,
          data: {},
          message: "成功"
        };
        res.send(data);
      }
    });
  });
};

export let postLogin = (req: Request, res: Response, next: NextFunction) => {
  const resFormat = new ResFormat();
  let resResult: IRes;
  req.assert("email", "Email is not valid").isEmail();
  req.assert("password", "Password cannot be blank").notEmpty();
  req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });
  const errors = req.validationErrors();

  if (errors) {
    resResult = resFormat.failLevel0({ message: "错误" });
    return res.send(errors);
  }

  User.findOne({ email: req.body.email }, function(err, user: any) {
    if (err) {
      return next(err);
    }
    if (!user) {
      resResult = resFormat.failLevel0({ message: "用户名错误!" });
      return res.send(resResult);
    }

    user.comparePassword(req.body.password, (err: Error, isMatch: boolean) => {
      if (err) {
        return next(err);
      }
      if (!isMatch) {
        resResult = resFormat.failLevel0({ message: "密码错误!" });
        return res.send(resResult);
      }
      resResult = resFormat.succeed({ message: "登录成功", data: user.id });
      return res.send(resResult);
    });
  });

  // passport.authenticate("local", (err: Error, user: UserModel, info: IVerifyOptions) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (!user) {
  //     resResult = resFormat.failLevel0({ message: "登录失败, 用户名不存在或密码错误" });
  //     return res.send(resResult);
  //   }
  //   req.logIn(user, err => {
  //     if (err) {
  //       return next(err);
  //     }
  //     resResult = resFormat.succeed({ message: "登录成功", data: req.user.id });
  //     return res.send(resResult);
  //   });
  // })(req, res, next);
};

export let postSignUp = (req: Request, res: Response, next: NextFunction) => {
  req.assert("email", "Email is not valid").isEmail();
  req.assert("password", "Password must be at least 4 characters long").len({ min: 4 });
  req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);
  req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();
  const resFormat = new ResFormat();
  let resResult: IRes;
  if (errors) {
    resResult = resFormat.failLevel0({ message: "错误" });
    return res.send(errors);
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      resResult = resFormat.failLevel0({ message: "该电子邮件地址的帐户已经存在。" });
      return res.send(resResult);
    }
    user.save(err => {
      if (err) {
        return next(err);
      }
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }
        resResult = resFormat.succeed({ message: "注册成功" });
        return res.send(resResult);
      });
    });
  });
};

export let postUpdatePwd = (req: Request, res: Response, next: NextFunction) => {
  req.assert("password", "Password must be at least 4 characters long").len({ min: 4 });
  req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);

  const errors = req.validationErrors();

  const resFormat = new ResFormat();
  let resResult: IRes;
  if (errors) {
    resResult = resFormat.failLevel0({ message: "错误" });
    return res.send(errors);
  }

  User.findById(req.body.id, (err, user: UserModel) => {
    if (err) {
      return next(err);
    }

    // 修改密码，，密码并没有加密
    // user.update(<UserModel>{ password: req.body.password }, error => {
    //   if (err) {
    //     return next(err);
    //   }
    //   resResult = resFormat.succeed({ message: "修改成功" });
    //   return res.send(resResult);
    // });

    /**
     * 另一个修改保存的方法
     */
    user.password = req.body.password;
    user.save((err: WriteError) => {
      if (err) {
        return next(err);
      }
      resResult = resFormat.succeed({ message: "修改成功" });
      return res.send(resResult);
    });
  });
};

export let postDeletePwd = (req: Request, res: Response, next: NextFunction) => {
  const errors = req.validationErrors();

  const resFormat = new ResFormat();
  let resResult: IRes;
  if (errors) {
    resResult = resFormat.failLevel0({ message: "错误" });
    return res.send(errors);
  }

  User.remove(<UserModel>{ _id: req.body.id }, err => {
    if (err) {
      return next(err);
    }
    resResult = resFormat.succeed({ message: "删除成功" });
    return res.send(resResult);
  });
};

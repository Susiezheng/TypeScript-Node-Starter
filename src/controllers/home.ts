import { Request, Response, NextFunction } from "express";
import { default as Home } from "../models/home";

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
    res.send({ error: "失败" });
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

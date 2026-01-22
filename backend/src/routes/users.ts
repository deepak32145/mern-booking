import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({
      email: req.body.email,
    });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User(req.body);
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 86400000,
    });
    return res.status(200).send({message : "user created"});
  } catch (err) {
    res.status(500).send({ message: "Technical Error" });
  }
});

export default router;
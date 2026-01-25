import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";


declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check(
      "password",
      "passwod shoul be of minimum 6 characters length"
    ).isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    console.log(errors.isEmpty());
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "invalid creds" });
      }
      let isMatch;
      if (user?.password) {
        isMatch = await bcrypt.compare(password, user?.password);
      }
      if (!isMatch) {
        return res.status(400).json({ message: "invalid creds" });
      }
      if (user) {
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: "1d" },
        );
        res.cookie("auth_token", token, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 86400000,
        });
        res.status(200).json({ userId: user._id });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    }
  },
);

router.post("/logout", (req : Request , res : Response) =>{
  res.cookie("auth_token" , "" , {
    expires : new Date(0),
  });
  res.send();
});

router.get("/validate-token" , verifyToken , (req : Request , res : Response) =>{
  res.status(200).json({userId : req.userId});
} )

export default router;

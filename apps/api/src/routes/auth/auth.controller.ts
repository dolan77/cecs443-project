import { v4 as uuidv4 } from "uuid";
import { sign } from "jsonwebtoken";
import { accountsSchema } from "../../schemas";
import { ApiError, Account, env } from "../../tools";
import { Request, Response, NextFunction } from "express";

export default class AuthController {
  static async signUp(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      ApiError.check("body", { email, password });
      const user = await accountsSchema.create({
        email, // email: Account.encrypt(email),
        password, // password: Account.encrypt(password),
        username: email,
      });
      const token = sign({ userId: user._id }, env.JWT_KEY);
      res.cookie("jwt", token);
      res.json({ code: 200, message: `New user ${user._id}`, data: { token } });
    } catch (e) {
      if (e.code === 11000) next(new ApiError(409, "User already exists"));
      else next(e);
    }
  }

  static async signIn(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      ApiError.check("body", { email, password });
      const user = await accountsSchema.findOne({ email }); // Account.encrypt(email)
      if (!user) throw new ApiError(404, "User not found");
      // if (!Account.verify(password, user.password)) throw new ApiError(403, "Invalid password");
      if (password !== user.password) throw new ApiError(403, "Invalid password");
      const token = sign({ userId: user._id }, env.JWT_KEY);
      res.cookie("jwt", token);
      res.json({ code: 200, message: `Logged-in user ${user._id}`, data: { token } });
    } catch (e) {
      next(e);
    }
  }
}

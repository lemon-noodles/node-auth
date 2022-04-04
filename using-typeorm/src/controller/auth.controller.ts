import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/user.entity";

export const Register = async (req: Request, res: Response) => {
  const body = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const userExists = await userRepository.findOne({
    where: { email: req.body.email },
  });

  if (body.password !== body.confirm_password) {
    return res.status(400).send({ message: "Passwords do not match" });
  }

  if (userExists) {
    return res.status(400).send({ message: "Email is already registered!" });
  }

  const user = new User();
  user.first_name = body.first_name;
  user.last_name = body.last_name;
  user.password = await bcryptjs.hash(body.password, 10);
  user.email = body.email;

  const { password, ...savedUser } = await AppDataSource.manager.save(user);

  res.send(savedUser);
};

export const Login = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { email: req.body.email },
    select: { id: true, password: true },
  });

  if (!user) {
    return res.status(400).send({ message: "Invalid credentials!" });
  }

  if (!(await bcryptjs.compare(req.body.password, user.password))) {
    return res.status(400).send({ message: "Invalid credentials!" });
  }

  const token = sign({ id: user.id }, process.env.JWT_SECRET);

  res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  res.send({ message: "success" });
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
  res.send(req["user"]);
};

export const Logout = (req: Request, res: Response) => {
  res.cookie("jwt", "", { httpOnly: true, maxAge: 0 });
  res.send({ message: "success" });
};

export const UpdateInfo = async (req: Request, res: Response) => {
  const { password, ...updatedUser } = req["user"];

  const userRepository = AppDataSource.getRepository(User);
  let user = await userRepository.findOneBy({
    id: updatedUser.id,
  });

  user = { ...user, ...req.body };
  await userRepository.save(user);

  res.send(
    await userRepository.findOneBy({
      id: updatedUser.id,
    })
  );
};

export const UpdatePassword = async (req: Request, res: Response) => {
  const body = req.body;
  const user = req["user"];
  const userRepository = AppDataSource.getRepository(User);
  let userRecord = await userRepository.findOne({
    where: { id: user.id },
    select: { id: true, password: true },
  });

  if (!body.old_password) {
    return res
      .status(400)
      .send({ message: "Please add old password. Or reset your password." });
  }

  if (!(await bcryptjs.compare(body.old_password, userRecord.password))) {
    return res.status(400).send({ message: "Old password is invalid!" });
  }

  if (body.password !== body.confirm_password) {
    return res.status(400).send({ message: "Passwords do not match" });
  }

  userRecord = {
    ...userRecord,
    password: await bcryptjs.hash(body.password, 10),
  };

  await userRepository.save(userRecord);
  res.send({message:"Password updated!"});
};

import pc from "@prisma/client";
import { AuthenticationError, ForbiddenError } from "apollo-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new pc.PrismaClient();

const resolvers = {
  Query: {
    users: async (parent, args, ctx) => {
      const { user_id } = ctx;
      if (!user_id) {
        throw new ForbiddenError("You must be logged in");
      }

      // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#not
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          id: {
            not: user_id,
          },
        },
      });
      return users;
    },
  },
  Mutation: {
    signupUser: async (parent, args, ctx) => {
      const { new_user } = args;
      const userExists = await prisma.user.findUnique({
        where: { email: new_user.email },
      });

      if (userExists) {
        throw new AuthenticationError("User already exists!");
      }

      const password = await bcrypt.hash(new_user.password, 10);
      const newUser = await prisma.user.create({
        data: {
          ...new_user,
          password,
        },
      });

      return newUser;
    },
    signinUser: async (parent, args, ctx) => {
      const { user_cred } = args;
      const user = await prisma.user.findUnique({
        where: { email: user_cred.email },
      });

      if (!user) {
        throw new AuthenticationError("Invalid credentials.");
      }

      const isAuthenticated = await bcrypt.compare(
        user_cred.password,
        user.password
      );

      if (!isAuthenticated) {
        throw new AuthenticationError("Invalid credentials.");
      }

      const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET);
      return { token };
    },
  },
};

export default resolvers;

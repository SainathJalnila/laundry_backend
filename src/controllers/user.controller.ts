import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { sendError, sendSuccess } from "../utils/response";
import { hashPassword, verifyPassword } from "../utils/password";
// utils

const prisma = new PrismaClient();

// ------------------------------ AUTH CONTROLLER ------------------------------ \\

const register = async (req: Request, res: Response) => {
  try {
    const { name, mobile_number, country_code, email, password } = req.body;

    const isMobileExist = await prisma.user.findFirst({
      where: {
        mobile_number: mobile_number,
        country_code: country_code,
      },
    });

    if (isMobileExist) {
      sendError(
        res,
        "Mobile number already exists",
        { status: 400, errors: { mobile_number: "Mobile number already exists" } }
      );
      return;
    }
if (email) {
    const isEmailExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (isEmailExist) {
      sendError(res, "Email is already exist", { status: 400, errors: { email: "Email already is exist" } });
      return;
    }
}
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        mobile_number,
        country_code,
        email: email || '',
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        mobile_number: true,
        country_code: true,
        email: true,
        createdAt: true,
        updatedAt: true
      },
    });

    sendSuccess(res, "User Register successfully.", { data: user }, 201);
  } catch (error) {
    console.log(error)
    sendError(res, "Internal server error", { status: 500 });
    return;
  }
};

const login = async (req: Request, res: Response) => {
    try {
        const { mobile_number, country_code, password } = req.body;

    const isNotExist = await prisma.user.findFirst({
            where: {
                country_code: country_code,
                mobile_number: mobile_number
            }
        });

        if (!isNotExist) {
            sendError(res, "Invalid credentials" , {status: 400, errors: { mobile_number: "User is not register pls resgiter"} })
            return
        }

        const user = await prisma.user.findFirst({
            where: { mobile_number, country_code },
        });

        if (!user) {
            sendError(res, { mobile_number: "Invalid credentials" }, { status: 400 });
            return;
        }

        const verifyPass = await verifyPassword(password, user.password);
        if (!verifyPass) {
            sendError(res, 'Password mismatched', { status: 400, errors: { password: "Invalid credentials" } });
            return;
        }

        sendSuccess(res, 'Login successful', { id: user.id, name: user.name, mobile_number: user.mobile_number, country_code: user.country_code, email: user.email });
        
    } catch(error) {
        sendError(res, "Internal server error", { status: 500 });
    }
}

export { register, login };

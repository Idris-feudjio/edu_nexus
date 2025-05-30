
import {  } from "class-transformer";
import { Prisma, User } from "@prisma/client";
import { IsBoolean, IsEmail, IsNotEmpty, IsString, } from "class-validator";
import { PrismaClient } from "generated/prisma";

export class UserCreateStudentDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  role?: User["role"] = "STUDENT";
 
  @IsBoolean({})
  isActive?: boolean;
}
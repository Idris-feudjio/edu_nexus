import {
  IsBoolean,
  IsEmail, 
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '@prisma/client'; 

export interface UserData extends User {}

export class UserDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsEmail()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  role?: User["role"] = "STUDENT";

  @IsOptional()
  @IsString()
  otp: string | null;

  @IsOptional()
  @IsString()
  otpExpiry: Date | null;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  department: string | null;

  @IsOptional()
  @IsString()
  level: string | null;

  @IsOptional()
  @IsString()
  class: string | null;

  @IsOptional()
  @IsString()
  createdAt: Date;

  @IsOptional()
  @IsString()
  updatedAt: Date;
}
export class CreateStudent implements Partial<User> {
  @IsEmail()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  otp?: string | null;

  @IsOptional()
  @IsString()
  otpExpiry?: Date | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  department?: string | null;

  @IsOptional()
  @IsString()
  level?: string | null;

  @IsOptional()
  @IsString()
  class?: string | null;

  @IsOptional()
  @IsString()
  createdAt?: Date;

  @IsOptional()
  @IsString()
  updatedAt?: Date;

  @IsOptional()
  @IsString()
  role: User["role"] = "STUDENT";
}

export class SimpleUserProfileSummary{
  id:number;
  email:string;
  firstName:string; 
  lastName:string;
  role:string
}
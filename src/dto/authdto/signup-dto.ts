import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignupDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

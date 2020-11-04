import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public username: string;

  @IsString()
  public password: string;
}

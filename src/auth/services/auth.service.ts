import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { User } from "src/models";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async addUser(data: any) {
    const { name, email, password } = data;
    const newuser = new this.userModel({ name, email, password });
    return newuser.save();
  }
  async findOneUserEmail(email: string): Promise<string | null> {
    return this.userModel.findOne({ email }).catch(err => null);
  }
}

import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class FacebookData {
  @prop({ required: true })
  public fb_name!: string;
  @prop({ required: true, unique: true })
  public fb_image!: string;
}
export class User {
  public _id?: string;
  @prop({ required: true })
  public name!: string;
  @prop({ required: true, unique: true })
  public email!: string;
  @prop({ required: true })
  public password!: string;
  @prop({ required: true, default: false })
  public isAdmin!: boolean;
  @prop({ required: false })
  public facebookData?: FacebookData;
}

export const UserModel = getModelForClass(User);

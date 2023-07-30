import {
  modelOptions,
  prop,
  getModelForClass,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { User } from "./userModel";

@modelOptions({ schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW } })
export class Post {
  public _id?: string;
  @prop({ required: true })
  public what!: {
    text: string;
    files: string[];
    isVideo: boolean;
    isWithMedia: boolean;
  };

  @prop({ required: true })
  public where!: [{ name: string; id: string }];

  @prop({ required: true })
  public isPending!: boolean;

  @prop({ required: true })
  public isActive!: boolean;

  @prop({ required: true })
  public notes!: string[];

  @prop({ required: true })
  public when!: {
    startDate: string;
    endDate: string;
    checkedDays: string[];
  };

  @prop({ ref: User })
  public user?: Ref<User>;
}

export const PostModel = getModelForClass(Post);

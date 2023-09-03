import {
  modelOptions,
  prop,
  getModelForClass,
  Severity,
} from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW } })

export class Fb {
  @prop({ required: true })
  public userName!: string;

  @prop({ required: true })
  public password!:string;

}

export const FbModel = getModelForClass(Fb);

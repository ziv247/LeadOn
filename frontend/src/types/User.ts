export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  facebookData: FacebookData
};
export type FacebookData = {
  fb_name:string;
  fb_image:string;
};
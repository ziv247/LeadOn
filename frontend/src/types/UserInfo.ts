export type UserInfo = {
  userName: string;
  password: string;
  groups: string[];
  // email: string;
  // tel: string;
  // isAdmin: boolean;
  facebookData: FacebookData;
};
export type FacebookData = {
  fb_name: string;
  fb_image: string;
  fb_userID: string;
  fb_email: string;
  accessToken: string;
};

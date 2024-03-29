import { User } from "./User";

export type Post = {
  createdAt?: string ;
  _id?: string;
  what: What;
  where: Where;
  when: When;
  user?: User;
  isPending?: boolean;
  isActive?: boolean;
  notes?: string[];
};

export type What = {
  text: string;
  files: string[];
  isVideo: boolean;
  isWithMedia: boolean;
};

export type Where = [{ name: string; id: string }];

export type When = {
  startDate: string;
  endDate: string;
  checkedDays: string[];
};

import { useContext } from "react";
import { Store } from "../Store";
import AdminStartPage from "./AdminStartPage";
import UserStartPage from "./UserStartPage";

export default function StartPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  return userInfo?.isAdmin ? <AdminStartPage /> : <UserStartPage />;
}

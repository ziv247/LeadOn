import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import {
  useSigninMutation,
  useUpdateFacebookMutation,
} from "../hooks/userHooks";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { toast } from "react-toastify";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import FacebookLogin from "react-facebook-login";
import { FacebookData, UserInfo } from "../types/UserInfo";
import SignupPage from "./SignupPage";
import SignInForm from "../components/SignInForm";

export default function SigninPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const [isLoggedinFb, setIsLoggedinFb] = useState(false);

  const { mutateAsync: signin, error } = useSigninMutation();

  const submitHandler = async (e: React.SyntheticEvent) => {
    setIsLoading(true);
    e.preventDefault();
    console.log("y like this my friend");
    try {
      const data = await signin({
        userName,
        password,
      });
      console.log(data);
      if (
        data.details.authenticated &&
        data.details.user &&
        data.details.success
      ) {
        data.groups = data.items.filter((x) => x.length > 0);
        dispatch({ type: "USER_SIGNIN", payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate(redirect || "/");
      }
      setIsLoading(false);

      // dispatch({ type: "USER_SIGNIN", payload: data });
      // localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      toast.error(getError(error as ApiError));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const { mutateAsync: updateUserFb } = useUpdateFacebookMutation();

  const responseFacebook = async (response: any) => {
    // setLoading(true);

    console.log(response);
    // logGroups(response.accessToken);
    // const groups = response.groups ? response.groups.data : [];
    const fbData: FacebookData = {
      fb_name: response.name,
      fb_image: response.picture.data.url,
      fb_userID: response.userID,
      fb_email: response.email,
      accessToken: response.accessToken,
    };
    let newUserInfo: UserInfo;

    try {
      newUserInfo = await signin({
        facebookData: fbData,
        // password,
      });

      console.log("data");
      console.log(newUserInfo);

      dispatch({ type: "USER_SIGNIN", payload: newUserInfo });
      localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
      navigate(redirect || "/");
    } catch (error) {
      dispatch({ type: "USER_FB_INFO", payload: fbData });
      newUserInfo = { ...userInfo } as UserInfo;

      setIsLoggedinFb(true);
      // toast.error(getError(error as ApiError));
    }
    newUserInfo.facebookData = fbData;
    localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>התחבר</title>
      </Helmet>
      <h1 className="my-3">התחברות ע"י פייסבוק</h1>
      <h4 className="my-3">
        על מנת שנוכל לפרסם את הפוסטים ולקבל את רשימת הקבוצות שאתם משויכים אליהם
        ההתחברות היא על ידי שם משתמש וסיסמא של פייסבוק. (ואלו גם פרטי ההתחברות
        לאתר)
      </h4>

      {isLoading ? (
        <LoadingBox />
      ) : isLoggedinFb ? (
        // <Form onSubmit={submitHandler}>
        //   <Form.Group className="mb-3" controlId="email">
        //     <Form.Label>אי-מייל</Form.Label>
        //     <Form.Control
        //       type="email"
        //       required
        //       onChange={(e) => setEmail(e.target.value)}
        //     />
        //   </Form.Group>
        //   <Form.Group className="mb-3" controlId="password">
        //     <Form.Label>סיסמה</Form.Label>
        //     <Form.Control
        //       type="password"
        //       required
        //       onChange={(e) => setPassword(e.target.value)}
        //     />
        //   </Form.Group>
        //   <div className="mb-3">
        //     <Button disabled={isLoading} type="submit">
        //       התחבר
        //     </Button>
        //     {isLoading && <LoadingBox />}
        //   </div>
        //   <div className="mb-3">
        //     לקוח חדש?{" "}
        //     <Link to={`/signup?redirect=${redirect}`}>הרשם עכשיו</Link>
        //   </div>
        // </Form>
        <SignupPage />
      ) : (
        <SignInForm
          submitHandler={submitHandler}
          setUserName={setUserName}
          setPassword={setPassword}
        />
        // <FacebookLogin
        //   // appId="304670265335533"
        //   // appId="187099754302555"
        //   appId="835720701468442"
        //   autoLoad={false}
        //   version="17.0"
        //   fields="name,email,picture,groups"
        //   scope="groups_access_member_info"
        //   callback={responseFacebook}
        //   size="small"
        // />
      )}
    </Container>
  );
}

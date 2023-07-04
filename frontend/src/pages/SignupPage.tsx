import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { useSignupMutation } from "../hooks/userHooks";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { toast } from "react-toastify";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";

export default function SignupPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const { mutateAsync: signup, isLoading } = useSignupMutation();

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password do not match");
      return;
    }
    try {
      const data = await signup({
        name,
        email,
        password,
      });
      dispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect);
    } catch (error) {
      toast.error(getError(error as ApiError));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>הרשם</title>
      </Helmet>
      <h1 className="my-3">הרשם</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>שם</Form.Label>
          <Form.Control required onChange={(e) => setName(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>אי-מייל</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>סיסמה</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirm-password">
          <Form.Label>אשר סיסמה</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <div className="mb-3">
          <Button disabled={isLoading} type="submit">
            הרשם
          </Button>
          {isLoading && <LoadingBox />}
        </div>
        <div className="mb-3">
          יש לך משתמש כבר?{" "}
          <Link to={`/signin?redirect=${redirect}`}>התחבר</Link>
        </div>
      </Form>
    </Container>
  );
}

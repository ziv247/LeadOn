import { Button, Form } from "react-bootstrap";
import LoadingBox from "./LoadingBox";
import { Link } from "react-router-dom";
import { FormEventHandler } from "react";

export default function SignInForm(props: { submitHandler: FormEventHandler<HTMLFormElement> | undefined; setUserName: (arg0: string) => void; setPassword: (arg0: string) => void; }) {
  return (
    <Form onSubmit={props.submitHandler}>
      <Form.Group className="mb-3" controlId="email">
        <Form.Control
          type="text"
          required
          placeholder='דוא"ל או מספר טלפון'
          onChange={(e) => props.setUserName(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Control
          type="password"
          required
          placeholder="סיסמה"
          onChange={(e) => props.setPassword(e.target.value)}
        />
      </Form.Group>
      <div className="mb-3">
        <Button
          disabled={false}
          type="submit"
          style={{
            backgroundColor: "#1877f2",
            color: "white",
            fontWeight: "400",
          }}
        >
          התחברות
        </Button>
        {false && <LoadingBox />}
      </div>
      {/* <div className="mb-3">
          לקוח חדש? <Link to={`/signup?redirect=${redirect}`}>הרשם עכשיו</Link>
        </div> */}
    </Form>
  );
}

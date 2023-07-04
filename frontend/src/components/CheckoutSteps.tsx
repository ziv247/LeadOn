import { Col, Row } from "react-bootstrap";

export default function CheckoutSteps(props: {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
}) {
  return (
    <Row className="checkout-steps">
      <Col className={props.step1 ? "active" : ""}>מה לפרסם</Col>
      <Col className={props.step2 ? "active" : ""}>איפה לפרסם</Col>
      <Col className={props.step3 ? "active" : ""}>מתי לפרסם</Col>
      <Col className={props.step4 ? "active" : ""}>אישור פרטים</Col>
    </Row>
  );
}

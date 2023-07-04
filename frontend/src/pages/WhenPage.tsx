import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "../components/CheckoutSteps";
import { Button, Form } from "react-bootstrap";

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

export default function WhenPage() {
  const navigate = useNavigate();
  const { state } = useContext(Store);

  const [startDate, setStartDate] = useState("00:00");
  const [endDate, setEndDate] = useState("00:00");
  const [checkedDays, setCheckedDays] = useState([]);

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(startDate);
    console.log(endDate);
    console.log(checkedDays);
    localStorage.setItem("whenSection", JSON.stringify({ startDate,
      endDate,
      checkedDays }));

    navigate("/summary");
  };

  const startTimeHandler = (e) => {
    console.log(e.target.value);
    setStartDate(e.target.value);
  };

  const endTimeHandler = (e) => {
    console.log(e.target.value);
    setEndDate(e.target.value);
  };

  const dayHandler = (e, day) => {
    console.log(e.target.checked, day);
    if (e.target.checked) {
      !checkedDays.includes(day) && setCheckedDays((prev) => [...prev, day]);
    } else {
      setCheckedDays((prev) => prev.filter((d) => d != day));
    }
    // setStartDate(e.target.value)
  };

  return (
    <div>
      <Helmet>
        <title>לידאון - מתי לפרסם</title>
      </Helmet>

      <CheckoutSteps step1 step2 step3></CheckoutSteps>

      <div className="container small-container">
        <h1 className="my-3">מתי לפרסם</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>משעה</Form.Label>
            <Form.Control type="time" onChange={startTimeHandler} />
            <Form.Label>עד שעה</Form.Label>
            <Form.Control type="time" onChange={endTimeHandler} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>ימים :</Form.Label>
            <br></br>
            {days.map((day) => (
              <Form.Check
                inline
                label={day}
                name={day}
                type="checkbox"
                id={day}
                key={day}
                onChange={(e) => dayHandler(e, day)}
              />
            ))}
          </Form.Group>

          <div className="mb-3">
            <Button variant="primary" type="submit">
              המשך
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

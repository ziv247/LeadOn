/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "../components/CheckoutSteps";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

export default function WhenPage() {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("08:00");
  const [endDate, setEndDate] = useState("13:00");
  const [checkedDays, setCheckedDays] = useState<any[]>([]);

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();

    localStorage.setItem(
      "whenSection",
      JSON.stringify({ startDate, endDate, checkedDays })
    );

    navigate("/summary");
  };

  const startTimeHandler = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    if (e.target.value < endDate) {
      setStartDate(e.target.value);
      return;
    }
    toast.error("זמן התחלה חייב להיות קטן מזמן הסיום.");
  };

  const endTimeHandler = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    if (e.target.value > startDate) {
      setEndDate(e.target.value);
      return;
    }
    toast.error("זמן הסיום חייב להיות גדול מזמן ההתחלה.");
  };

  const dayHandler = (e: React.ChangeEvent<HTMLInputElement>, day: string) => {
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
            <Form.Control
              type="time"
              onChange={startTimeHandler}
              value={startDate}
              max={endDate}
            />
            <Form.Label>עד שעה</Form.Label>
            <Form.Control
              type="time"
              onChange={endTimeHandler}
              value={endDate}
              min={startDate}
            />
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

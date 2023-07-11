import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function NoteModal(props: { callback: (arg0: string) => void; }) {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = () => {
    props.callback(text);
    setShow(false);
  };

  function handleTextChange(event: any): void {
    setText(event.target.value);
  }

  return (
    <>
      <Button variant="warning" size="sm" onClick={handleShow}>
        הוסף הערה
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>הערה</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>הערה</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={handleTextChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            סגור
          </Button>
          <Button variant="primary" onClick={handleSave}>
            שמור
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NoteModal;

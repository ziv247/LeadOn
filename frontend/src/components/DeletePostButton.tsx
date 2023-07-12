import { Button } from "react-bootstrap";

const DeletePostButton = (props: { post: any }) => {
  const { post } = props;

  const onClickHandler = async () => {
    alert("נמחק! סתם סתם,אוטוטו הכפתור יעבוד:)");
  };

  return (
    <div>
      <Button style={{ background: "lightcoral" }} onClick={onClickHandler}>
        מחיקת פוסט
      </Button>
    </div>
  );
};
export default DeletePostButton;

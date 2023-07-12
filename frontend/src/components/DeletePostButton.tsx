import { Button } from "react-bootstrap";
import { Post } from "../types/Post";

const DeletePostButton = (props: { post: Post }) => {
  const { post } = props;

  const onClickHandler = async () => {
    alert("נמחק! סתם סתם,אוטוטו הכפתור יעבוד:) "+post._id);
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

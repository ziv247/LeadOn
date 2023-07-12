import { Button } from "react-bootstrap";
import { Post } from "../types/Post";

const DeletePostButton = (props: { post: Post,onDeleteClicked:any }) => {
  const { onDeleteClicked } = props;

  const onClickHandler = async (e: any) => {
    e.target.disable = true;
    onDeleteClicked()
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

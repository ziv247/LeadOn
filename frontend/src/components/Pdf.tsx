/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";

export default function Pdf(props: { post: any; }) {
  const { post } = props
 

  const copyHandler = (txt:string) => {
    toast.success("הועתק", { autoClose: 1500 });
    navigator.clipboard.writeText(txt);
  };
  return (
    <div id="pdf_container" dir="rtl">
      <h5>גוף הפוסט:</h5>
      <p className="copy-container">
        {post.what.text}
        <i
          className="fas fa-copy inner"
          onClick={() => copyHandler(post.what.text)}
        ></i>
      </p>
      <h5>קבוצות:</h5>
      <ul>
        {post.where.map((grp:{id:string,name:string}) => (
          <li key={grp.id} className="copy-container">
            {grp.name}{" "}
            <i
              className="fas fa-copy inner"
              onClick={() => copyHandler(grp.name)}
            ></i>
          </li>
        ))}
      </ul>
      <h5>ימים:</h5>
      <ul>
        {post.when.checkedDays.map((day:string, idx:number) => (
          <li key={idx} className="copy-container">
            {day}{" "}
            <i
              className="fas fa-copy inner"
              onClick={() => copyHandler(day)}
            ></i>
          </li>
        ))}
      </ul>
      <h5>שעות:</h5>
      <p>
        מהשעה - <b>{post.when.startDate}</b> עד השעה <b>{post.when.endDate}</b>
      </p>
    </div>
  );
}

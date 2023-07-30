/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "../components/CheckoutSteps";
import { Button, Form } from "react-bootstrap";
import FacebookLogin from "react-facebook-login";
import axios from "axios";
import LoadingBox from "../components/LoadingBox";
import { useUpdateFacebookMutation } from "../hooks/userHooks";
import { UserInfo } from "../types/UserInfo";

// const groups = [
//   {
//     name: "\u05d3\u05e8\u05d5\u05e9\u05d9\u05dd - \u05de\u05e9\u05e8\u05d5\u05ea \u05d4\u05d9\u05d9\u05d8\u05e7 - \u05de\u05e4\u05ea\u05d7\u05d9\u05dd",
//     id: "126170691048605",
//   },
//   {
//     name: "\u05d3\u05e8\u05d5\u05e9\u05d9\u05dd - \u05de\u05e9\u05e8\u05d5\u05ea \u05d2\u05d9\u05d9\u05de\u05d9\u05e0\u05d2",
//     id: "216458105817281",
//   },
//   {
//     name: "\u05de\u05d6\u05d9\u05d6\u05d9 \u05d4\u05d8\u05e8\u05e0\u05e1\u05e4\u05d5\u05e8\u05de\u05d9\u05dd - \u05d4\u05e7\u05d1\u05d5\u05e6\u05d4",
//     id: "836631284164229",
//   },
//   {
//     name: "\u05d3\u05e8\u05d5\u05e9\u05d9\u05dd - \u05de\u05e9\u05e8\u05d5\u05ea \u05d4\u05d9\u05d9\u05d8\u05e7",
//     id: "1167283816632326",
//   },
//   {
//     name: '\u05de\u05e9\u05e8\u05d5\u05ea \u05d4\u05d9\u05d9\u05d8\u05e7 \u05d1\u05d9\u05df \u05d7\u05d1\u05e8\u05d9\u05dd, \u05dc\u05e4\u05e0\u05d9 \u05e9\u05de\u05ea\u05e4\u05e8\u05e1\u05de\u05d5\u05ea \u05d1\u05d7\u05d1\u05e8\u05d5\u05ea \u05db"\u05d0',
//     id: "172699927676",
//   },
//   {
//     name: "\u05de\u05e9\u05e8\u05d5\u05ea \u05d1\u05d4\u05d9\u05d9\u05d8\u05e7 \u05d5\u05d1\u05e1\u05d8\u05d0\u05e8\u05d8 \u05d0\u05e4\u05d9\u05dd- \u05e2\u05dd \u05d0\u05d5 \u05d1\u05dc\u05d9 \u05e0\u05e1\u05d9\u05d5\u05df",
//     id: "609641652802760",
//   },
//   {
//     name: "\u05de\u05e9\u05e8\u05d5\u05ea \u05d4\u05d9\u05d9\u05d8\u05e7 \u05d5\u05e9\u05d9\u05d5\u05d5\u05e7 \u05dc\u05dc\u05d0 \u05e0\u05e1\u05d9\u05d5\u05df",
//     id: "371392283062963",
//   },
//   {
//     name: "\u05dc\u05e6\u05d0\u05ea \u05de\u05db\u05dc\u05d5\u05d1 \u05d4\u05d6\u05d4\u05d1",
//     id: "1537729103257241",
//   },
//   {
//     name: "\u05d2\u05f3\u05d5\u05e0\u05d9\u05d5\u05e8\u05d9\u05dd \u05d1\u05d4\u05d9\u05d9\u05d8\u05e7 \u05d4\u05d9\u05e9\u05e8\u05d0\u05dc\u05d9 - \u05de\u05e9\u05e8\u05d5\u05ea | \u05d8\u05d9\u05e4\u05d9\u05dd | \u05e2\u05d1\u05d5\u05d3\u05d4",
//     id: "2786770884931764",
//   },
//   {
//     name: '"\u05de\u05d4\u05db\u05d5\u05e8\u05e1\u05d0 \u05dc\u05e2\u05ea\u05d9\u05d3 \u05d1\u05d8\u05d5\u05d7" \u05e7\u05d4\u05d9\u05dc\u05ea \u05d4\u05e9\u05e7\u05e2\u05d5\u05ea \u05e0\u05d3\u05dc"\u05df \u05d5\u05d4\u05ea\u05e4\u05ea\u05d7\u05d5\u05ea \u05d0\u05d9\u05e9\u05d9\u05ea',
//     id: "945756935936729",
//   },
//   {
//     name: "Israeli Unity3d developers",
//     id: "117674854958307",
//   },
//   {
//     name: "\u05de\u05d5\u05e6\u05d0\u05d9\u05dd \u05e2\u05d1\u05d5\u05d3\u05d4 \u05d1\u05ea\u05e2\u05e9\u05d9\u05d9\u05ea \u05d4\u05d2\u05d9\u05d9\u05de\u05d9\u05e0\u05d2",
//     id: "1703362343294912",
//   },
//   {
//     name: "GameIS (Official)",
//     id: "475241519195118",
//   },
//   {
//     name: "\u05de\u05e9\u05e8\u05d5\u05ea \u05d4\u05d9\u05d9\u05d8\u05e7 \u05e9\u05d5\u05d5\u05ea \u05d1\u05d9\u05df \u05d7\u05d1\u05e8\u05d9\u05dd",
//     id: "1434209956684661",
//   },
//   {
//     name: "\u05de\u05ea\u05db\u05e0\u05ea\u05d9\u05dd \u05e4\u05e8\u05d9\u05dc\u05e0\u05e1\u05e8\u05d9\u05dd",
//     id: "1502756793303704",
//   },
//   {
//     name: "\u05e6\u05d5\u05e2\u05d3\u05d9\u05dd \u05e2\u05dd \u05d6\u05d9\u05e7 \u05dc\u05d7\u05d5\u05e4\u05e9 \u05db\u05dc\u05db\u05dc\u05d9",
//     id: "477736330393641",
//   },
//   {
//     name: "\u05de\u05ea\u05db\u05e0\u05ea\u05d5\u05ea \u05d5\u05de\u05ea\u05db\u05e0\u05ea\u05d9\u05dd \u05d2'\u05d5\u05e0\u05d9\u05d5\u05e8\u05d9\u05dd",
//     id: "645409222247058",
//   },
//   {
//     name: "\u05e6\u05e8\u05d5\u05ea \u05d1\u05d4\u05d9\u05d9\u05d8\u05e7 - \u05de\u05e9\u05e8\u05d5\u05ea \u05d5\u05e2\u05d5\u05d1\u05d3\u05d9\u05dd",
//     id: "194084838008928",
//   },
//   {
//     name: "\u05d4\u05e9\u05e7\u05e2\u05d5\u05ea \u05dc\u05e2\u05e6\u05dc\u05e0\u05d9\u05dd",
//     id: "964269737391041",
//   },
//   {
//     name: "React.js Israel",
//     id: "1541217342812064",
//   },
//   {
//     name: "\u05d1\u05e0\u05d9\u05d4 \u05e7\u05dc\u05d4 / \u05de\u05ea\u05e7\u05d3\u05de\u05ea",
//     id: "970822383424723",
//   },
//   {
//     name: "\u05de\u05e9\u05e8\u05d5\u05ea \u05d7\u05de\u05d5\u05ea \u05d1\u05e1\u05d8\u05d0\u05e8\u05d8 \u05d0\u05e4\u05d9\u05dd",
//     id: "140353736108906",
//   },
//   {
//     name: "\u05de\u05e9\u05e8\u05d5\u05ea \u05d4\u05d9\u05d9\u05d8\u05e7 \u05d7\u05de\u05d5\u05ea \u05d1\u05d9\u05df \u05d7\u05d1\u05e8\u05d9\u05dd, \u05dc\u05de\u05ea\u05d7\u05d9\u05dc\u05d9\u05dd !",
//     id: "190861804281485",
//   },
//   {
//     name: "\u05de\u05e9\u05e8\u05d5\u05ea \u05de\u05ea\u05db\u05e0\u05ea\u05d9\u05dd/\u05d5\u05ea",
//     id: "968761129839470",
//   },
//   {
//     name: "\u05d8\u05d9\u05e1\u05d5\u05ea \u05e1\u05d5\u05d3\u05d9\u05d5\u05ea - \u05d4\u05e7\u05d4\u05d9\u05dc\u05d4",
//     id: "293000157875874",
//   },
// ];

export default function WherePage() {
  const navigate = useNavigate();

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const [userGroups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { mutateAsync: updateUserFb } = useUpdateFacebookMutation();

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    localStorage.setItem("whereSection", JSON.stringify(getCheckedGroups()));
    navigate("/when");
  };
  const getCheckedGroups = () => {
    return userGroups.filter((grp: { isChecked: boolean }) => grp.isChecked);
  };

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const onCheckedHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    group: { isChecked?: boolean; name?: string; id: any }
  ) => {
    const newGroups: any[] = [...userGroups];
    newGroups.map((grp: any) => {
      if (grp.id === group.id) {
        grp.isChecked = e.target.checked;
      }
    });

    setGroups(newGroups);
  };

  const loadMoreGroupsHandler = async (next: string) => {
    const res = await axios.get(next);

    setGroups((prev) => [...prev, ...res.data.data]);
    if (res.data.paging.next) {
      loadMoreGroupsHandler(res.data.paging.next);
    } else {
      setLoading(false);
    }
  };
  const componentClicked = (data: any) => {
    console.log("data:", data);
  };
  const responseFacebook = async (response: any) => {
    setLoading(true);
    // FB.api(`/${response.userID}/groups`, function (res) {
    //   if (res && !res.error) {
    //     /* handle the result */
    //     console.log("yay");
    //     console.log(res);
    //   }
    // });
    FB.api(
      '/me',
      'get',
      {"fields":"groups"},
      function(response) {
        console.log("yay");
            console.log(response);
      }
    );
    console.log(response);

    const groups = response.groups?.data;
    const fbData = {
      fb_name: response.name,
      fb_image: response.picture.data.url,
    };
    dispatch({ type: "USER_FB_INFO", payload: fbData });
    const newUserInfo: UserInfo = { ...userInfo };
    newUserInfo.facebookData = fbData;

    await updateUserFb(newUserInfo);

    localStorage.setItem("userInfo", JSON.stringify(newUserInfo));

    groups.map((grp: { isChecked: boolean }) => (grp.isChecked = false));
    setGroups(groups);
    if (response.groups.paging.next) {
      loadMoreGroupsHandler(response.groups.paging.next);
    } else {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>לידאון - איפה לפרסם</title>
      </Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps>

      <div className="container small-container">
        <h1 className="my-3">איפה לפרסם</h1>

        {loading ? (
          <LoadingBox />
        ) : userGroups.length > 0 ? (
          <Form onSubmit={submitHandler}>
            <Form.Control
              type="search"
              placeholder="חפש/י"
              className="mb-2"
              aria-label="Search"
              onChange={handleSearch}
            />
            <div className="scrolling mb-3">
              {userGroups
                .filter((group: { name: string; id: string }) =>
                  group.name.includes(search)
                )
                .map(
                  (group: { isChecked: boolean; name: string; id: string }) => (
                    <div key={group.id} className="mb-3 group-check">
                      <Form.Check // prettier-ignore
                        type="checkbox"
                        id={group.id}
                        label={group.name}
                        onChange={(e) => onCheckedHandler(e, group)}
                        checked={group.isChecked}
                      />
                    </div>
                  )
                )}
              {/* {userGroups.map((group: { name: string; id: string }) => (
                <div key={group.id} className="mb-3 group-check">
                  <Form.Check // prettier-ignore
                    type="checkbox"
                    id={group.id}
                    label={group.name}
                  />
                </div>
              ))} */}
              {/* {next && (
                <Button
                  variant="primary"
                  onClick={loadMoreGroupsHandler}
                  className="w-100"
                >
                  טען עוד קבוצות
                </Button>
              )} */}
            </div>

            <div className="mb-3">
              <Button
                variant="primary"
                type="submit"
                disabled={getCheckedGroups().length < 1}
              >
                המשך
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <h2>ייבא רשימת קבוצות מהפייסבוק</h2>
            <FacebookLogin
              // appId="304670265335533"
              // appId="187099754302555"
              appId="835720701468442"
              autoLoad={false}
              version="17.0"
              fields="name,email,picture,groups"
              scope="groups_access_member_info"
              callback={responseFacebook}
              onClick={componentClicked}
              size="small"
            />
          </>
        )}
      </div>
    </div>
  );
}

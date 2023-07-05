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

export default function WherePage() {
  const navigate = useNavigate();
  // const { state, dispatch } = useContext(Store);
  // const {
  //   cart: { shippingAddress, paymentMethod },
  // } = state;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  // const [paymentMethodName, setPaymentMethodName] = useState(
  //   paymentMethod || "PayPal"
  // );
  const [userGroups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { mutateAsync: updateUserFb } = useUpdateFacebookMutation();

  // useEffect(() => {
  //   if (!shippingAddress.address) {
  //     navigate("/shipping");
  //   }
  // }, [shippingAddress, navigate]);

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

  const responseFacebook = async (response: any) => {
    setLoading(true);

    const groups = response.groups.data;
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
              appId="3078631549097144"
              autoLoad={true}
              version="17.0"
              fields="name,email,picture,groups"
              callback={responseFacebook}
              size="small"
            />
          </>
        )}
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Post } from "../types/Post";

function SortingBar(props: { posts: Post[]; filteredListCB: any; }) {
  const { posts, filteredListCB } = props
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [filterBy, setFilterBy] = useState("");
  const [activeTarget, setActiveTarget] = useState<HTMLElement>();
  const [, setSearch] = useState();
  const oneDay = 24 * 60 * 60 * 1000;

  const filterClickedHandler = (e:any) => {
    const element = e.target as HTMLElement;
    setFilterBy(element.innerText);
    if (activeTarget) {
      activeTarget.classList.remove("active");
    }
    setActiveTarget(element);
    element.classList.add("active");
    const now = new Date();

    switch (e.target.id) {
      case "filter0":
        setFilteredPosts(posts.filter((post) => post.isPending == false))
        break;
      case "filter1":
        setFilteredPosts(posts.filter((post) => post.isPending == true))
        break;
      case "filter2":
        setFilteredPosts(
          posts.filter((post) => {
            const created = new Date(""+post.createdAt);
            const milli = now.getTime() - created.getTime();
            return milli < oneDay;
          })
        );
        break;
      case "filter3":
        setFilteredPosts(
          posts.filter((post) => {
            const created = new Date(""+post.createdAt);
            const milli = now.getTime() - created.getTime();
            return milli < (oneDay *7);
          })
        );
        break;

      default:
        setFilteredPosts(posts)
        break;
    }
    filteredListCB(filteredPosts);

  };

  const resetFilterHandler = () => {
    setFilterBy("");
    if (activeTarget) {
      activeTarget.classList.remove("active");
    }
    setActiveTarget(undefined);
    setFilteredPosts(posts)
    filteredListCB(filteredPosts)
  };

  const searchChangedHandler = (e:any) => {
    setSearch(e.target.value)
    filteredListCB(filteredPosts.filter(post=>post.what.text.toLowerCase().includes(e.target.value.toLowerCase()) || post.user?.name.toLowerCase().includes(e.target.value.toLowerCase())))

  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-3">
      <Container>
        <Navbar.Brand href="#home">פוסטים</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <NavDropdown title="פילטר" id="navbarScrollingDropdown">
              <NavDropdown.Item onClick={filterClickedHandler} id="filter0">
                אושרו
              </NavDropdown.Item>
              <NavDropdown.Item onClick={filterClickedHandler} id="filter1">
                לא אושרו
              </NavDropdown.Item>
              <NavDropdown.Item onClick={filterClickedHandler} id="filter2">
                24 שעות אחרונות
              </NavDropdown.Item>
              <NavDropdown.Item onClick={filterClickedHandler} id="filter3">
                שבוע אחרון
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={resetFilterHandler}>
                נקה
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#">{filterBy}</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="חיפוש"
              className="me-2"
              aria-label="Search"
              onChange={searchChangedHandler}
            />
            <Button variant="outline-success">חיפוש</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SortingBar;

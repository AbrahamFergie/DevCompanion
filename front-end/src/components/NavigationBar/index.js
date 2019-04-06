import React, { Component } from 'react';
import { Container, Row, Col, Navbar, Nav, Button, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';

require("./index.css");

export default class NavigationBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userLoggedIn: false
    }
  }

  componentDidMount() {
    const { state } = this.props.history.location

    this.setState({ userLoggedIn: state ? state.loggedIn : false })
  }

  componentWillMount() {
    this.unlisten = this.props.history.listen(({ state }) => {
      this.setState({ userLoggedIn: state.loggedIn })
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  handleLogout = async () => {
    const result = await axios.get("/api/auth/logout");
    if(result.status === 200) {
      this.setState({ userLoggedIn: false })
      window.location.href = "/"
    };
  }

  handleRedirect = async ( page ) => {
    const payload = await axios.get("/api/user/check-user")
    const { userLoggedIn, user } = payload.data
    if( userLoggedIn ) {
      this.props.history.push( page, { loggedIn: userLoggedIn, user })
    } else {
      this.props.history.push("/", { loggedIn: userLoggedIn, user })    
    }
  }

  handleHomeRoute = async () => {
    const payload = await axios.get("/api/user/check-user")
    const { userLoggedIn, user } = payload.data
    if( userLoggedIn ) {
      this.props.history.push( "/home", { loggedIn: userLoggedIn })    
    } else {
      this.props.history.push("/", { loggedIn: userLoggedIn })    
    }
  }
  
  render() {
    const { userLoggedIn } = this.state
    return (
      <Navbar className="fixed-top" collapseOnSelect expand="lg">
        <Navbar.Brand className="navvy"><Button variant="light" onClick={this.handleHomeRoute.bind(this)}>DevCompanion</Button></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="w-100">
            <ButtonGroup toggle>
              <Button type="button" variant="dark" defaultChecked value="1" className="navvy" onClick={this.handleRedirect.bind(this, "/home")}>Home</Button>
              <Button type="button" variant="dark" value="2" className="navvy" onClick={this.handleRedirect.bind(this, "/share-page")}>Shared</Button>
              <Button type="button" variant="dark" value="3" className="navvy" onClick={this.handleRedirect.bind(this, "/profile")}>Profile</Button>
            </ButtonGroup>
            <Row className="w-100 float-right">
              <Col className="float-right">
                { userLoggedIn ? <Button variant="secondary" onClick={this.handleLogout.bind(this)} className="btn float-right"><strong>Logout</strong></Button> : <div></div> }
              </Col>
            </Row>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
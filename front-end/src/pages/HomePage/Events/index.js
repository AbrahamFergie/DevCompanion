import React, { Component } from 'react';
import { Container, Button, Modal, Row, Col, Image, Form } from 'react-bootstrap';
import parse from 'html-react-parser';
import axios from 'axios';

require("./index.css");

const Meetup_API = "2657185b242c4410412771346973716d";

export class Events extends Component {
  constructor(props){
    super(props);
    this.state = {
      events: [],
      query: '',
      zip: 0,
      radius: 10,
      searchClicked: false
    }
  }
  
  componentDidMount = () => {
    this.getMeetups();
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleShareAction = ( index ) => {
    const { events } = this.state
    let event = events[ index ]
  
    axios.post("/api/share/check-shared", { type: "event", payload: event.link })
    .then( response => {
      const { found } = response.data
      if( found ) { 
        let newEvents = events
        event.found = true
        newEvents[ index ] = event

        return this.setState({ events: newEvents }) 
      } else {
        axios.post("/api/share/add", { type: "event", payload: event })
        .then( response => {
          const { shared } = response.data
          if( shared ) { 
            let newEvents = events
            event.shared = true
            newEvents[ index ] = event
            
            return this.setState({ events: newEvents })            
          }
        })
      }      
    })    
    .catch( err => {
      console.log('====err====', err)
    })
  }
  //Get Meetup API
  getMeetups = async () => {
    let { query, zip, radius, searchClicked } = this.state
    this.setState({ searchClicked: true })
    query.replace(" ", "_")
    const events = await axios.get(
      `https://cors-anywhere.herokuapp.com/api.meetup.com/find/groups?
      &zip=${ zip > 0 ? zip : 94544 }
      &text=${ query ? query : "programming" }
      &radius=${ radius ? radius : 10 }
      &key=${ Meetup_API }`,{ crossDomain: true }
    )
    this.setState({
      events: events.data,
      searchClicked: false
    })
  }
  
  render() {
    const { events, searchClicked } = this.state
    return (
      <Container fluid={true} className="center">
        <h2><u>Events</u></h2>
        <hr></hr>
        <Form className="">   
          <Row>
            <Col className="center" md>
              <Form.Group controlId="">
                <Form.Label>Keyword Search</Form.Label>
                <Form.Control type="text" name="query" onChange={ this.handleInputChange.bind( this )} placeholder="e.g. Software Developer, NodeJs" />
              </Form.Group>
            </Col>
            <Col className="center" md>
              <Form.Group controlId="">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control type="text" name="zip" onChange={ this.handleInputChange.bind( this )} placeholder="e.g. 94544" />
              </Form.Group>
            </Col>
            <Col className="center" md>
              <Form.Group controlId="">
                <Form.Label>Radius (in miles)</Form.Label>
                <Form.Control type="number" name="radius" onChange={ this.handleInputChange.bind( this )} placeholder="e.g. 10, 50, 100" />
              </Form.Group>          
            </Col>
          </Row>      
          <Row>
            <Col className="center">
              { searchClicked ? 
                <div className="spinner-border" role="status" variant="light">
                  <span className="sr-only">Loading...</span>
                </div>                
                : 
                <Button variant="dark" onClick={ this.getMeetups.bind( this )} type="button">
                  Search
                </Button>
              }
            </Col>
          </Row> 
        </Form>
        <hr></hr>
        <Row className="event-row">          
          { events ? events.map( (event, index) =>  {     
           let desc = event.description && typeof event.description === "string" ? parse(event.description) : "No description available";            
            return ( 
              <Col key={ index } md="4" className="center">

                <div className="event-title">
                  <h4>{ event.name }</h4>
                  <h5>{ event.localized_location }</h5>
                </div>

                <Button type="button" className="btn" variant="dark" data-toggle="modal" data-target={`#modal-${ index }`}>
                  Read More
                </Button>
                <a className="btn btn-outline-dark" href={ event.link } target="_blank" rel="noopener noreferrer">Go To Posting</a>                

                <div className="modal fade w-100" id={`modal-${ index }`} tabIndex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="">{ event.name }</h5>
                        <Button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </Button>
                      </div>
                      <div className="modal-body">
                        <Image src={ event.key_photo ? event.key_photo.photo_link : event.key_photo } thumbnail />
                        <h5><strong>Location: </strong>{ event.localized_location }</h5>
                        <div className="event-description">
                          <div><strong>Description: </strong>{ desc }</div>
                        </div>
                        <a className="btn btn-outline-dark" href={ event.link } target="_blank" rel="noopener noreferrer">Go To Posting</a>
                      </div>
                      <div className="modal-footer">
                        { event.shared || event.found ? 
                          event.found ?
                            <h3><strong>Already Shared</strong></h3>
                            :
                            <h3><strong>Shared</strong></h3>
                          :
                          <Button className="btn" variant="dark" onClick={ this.handleShareAction.bind(this, index) }>Share</Button> 
                        }
                        <Button type="button" className="btn btn-secondary" data-dismiss="modal">Close</Button>
                      </div>
                    </div>
                  </div>
                </div>           
                <hr></hr> 
              </Col>
            )
          }) : <div><br></br><h4 className="center">Loading...</h4><br></br></div>
        }
      </Row>
    </Container>
    )
  }
}

export default Events

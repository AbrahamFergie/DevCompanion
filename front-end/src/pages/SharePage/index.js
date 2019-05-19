import React, { Component } from 'react';
import { Container, Row, Col, Button, Modal, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
require('./index.css');

export class SharePage extends Component {
  constructor(props){
    super(props);
    this.state ={
      events: [],
      jobs: [],
      articles: []
    };
  }
  
  componentDidMount() {
    this.getSharedData()
  }

  getSharedData = () =>{
    axios.get('/api/share/shared-items')
    .then(response => {
      console.log(response);
      let res = response.data;
        
      this.setState({ 
        events: res.events,          
        jobs: res.jobs,
        articles: res.articles,
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
  const { articles, events, jobs } = this.state
  return (
      <Container fluid={true} className="">       
        <Row className="flex-center">
          <Col className="orient-shared">
            <strong><u><h3>Shared items</h3></u></strong>
            <hr></hr>
            <Tabs className="tabs" defaultActiveKey="news-feed" transition={false} id="noanim-tab-example">
              <Tab eventKey="news-feed" title="| News-Feed |">
                {/* If sharing an article */}
                <Col>
                <strong><u><h3 className="text-center">Articles</h3></u></strong>
                  <hr></hr>      
                  { articles ? articles.map( (article, index) => {
                    return (
                      <div key={index} >
                        {/* <p>"Profile pic"</p> */}
                        <small>{article.user} shared an article</small>
                        <a href={ article.url } target="_blank"><h5 className="">{ article.title }</h5></a>
                        <div>
                          { console.log('====article====', article) }
                          <Button size='sm' type="button" className="btn btn-dark">{ article.likes } Like</Button>
                          <Button size='sm' type="button" className="btn btn-dark">{ article.dislikes } Dislike</Button>
                        </div>
                        <hr></hr>
                      </div>              
                    )
                  }) : <div></div>}
                </Col>
              </Tab>
              <Tab eventKey="events" title="| Events |">
                {/* If sharing an event */}
                <Col>
                  <strong><u><h3 className="text-center">Events</h3></u></strong>
                  <hr></hr>
                  { events ? events.map( (event, index) => {            
                    return (
                      <div key={index}>
                        <small>{event.user} shared an event</small>
                        <a href={ event.link } target="_blank"><h5 className="">{ event.name }</h5></a>
                        <small>{event.localized_location}</small>
                        <div>
                          <Button size='sm' type="button" className="btn btn-dark">{ event.likes } Like</Button>
                          <Button size='sm' type="button" className="btn btn-dark">{ event.dislikes } Dislike</Button>                          
                        </div>
                        <hr></hr>
                      </div>
                    )
                  }): <div></div>}
                </Col>
              </Tab>
              <Tab eventKey="jobs" title="| Jobs |">
                {/* If sharing a job */}
                <Col>
                  <strong><u><h3 className="text-center">Jobs</h3></u></strong>
                  <hr></hr>
                  { jobs ? jobs.map( (job, index) => {
                    return (
                      <div key={index}>
                        <small>{job.user} shared a job</small>
                        <a href={ job.url } target="_blank"><h5 className="">{ job.title }</h5></a>
                        <small>Company: { job.company }  |  Location: { job.location }</small>
                        <div>
                          <Button size='sm' type="button" className="btn btn-dark">{ job.likes } Like</Button>
                          <Button size='sm' type="button" className="btn btn-dark">{ job.dislikes } Dislike</Button>                          
                        </div>
                        <hr></hr>
                      </div>
                    )
                  }): <div></div>}
                </Col>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
      )
    }
  }
export default SharePage;
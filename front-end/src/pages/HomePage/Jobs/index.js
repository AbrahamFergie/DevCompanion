import React, { Component } from 'react';
import { Container, Button, Image, Col, Row, Form } from 'react-bootstrap';
import axios from 'axios';
import parse from 'html-react-parser';
import { parseJsonSourceFileConfigFileContent } from 'typescript';

require("./index.css");

export class Jobs extends Component {
  constructor(props){
    super(props);
    this.state = {
      jobs: [],
      query: "",
      location: "",
      searchClicked: false
    }
  }

  componentDidMount = () => {
    this.getGitHubJobs();
  }
  
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  // handleShareAction( index ) {
  //   const { jobs } = this.state
  //   const job = jobs[ index ]
  //   axios.post("/api/share/add", { type: "job", payload: job })
  //   .then( response => {
  //     console.log("job response", response)
  //   })
  //   .catch( err => {
  //     console.log('====err====', err)
  //   })
  // }
  handleShareAction = ( index ) => {
    const { jobs } = this.state
    let job = jobs[ index ]
    console.log('====job====', job)
    axios.post("/api/share/check-shared", { type: "job", payload: job.url })
    .then( response => {
      const { found } = response.data
      if( found ) { 
        let newJobs = jobs
        job.found = true
        newJobs[ index ] = job

        return this.setState({ jobs: newJobs }) 
      } else {
        axios.post("/api/share/add", { type: "job", payload: job })
        .then( response => {
          const { shared } = response.data
          if( shared ) { 
            let newJobs = jobs
            job.shared = true
            newJobs[ index ] = job
            
            return this.setState({ jobs: newJobs })            
          }
        })
      }      
    })    
    .catch( err => {
      console.log('====err====', err)
    })
  }

  // Get GitHubJobs API.
  getGitHubJobs = async () => {
    let { query, location } = this.state;
    this.setState({ searchClicked: true })
    query.replace(" ", "_")
    location.replace(" ", "_")
    const jobs = await axios.get(
      `https://cors-anywhere.herokuapp.com/jobs.github.com/positions.json?description=${ query ? query : "Javascript" }&location=${ location ? location : "us" }`, { crossDomain: true }
    )

    this.setState({
      jobs: jobs.data,
      searchClicked: false
    })
  }
    
  render() {
    const { jobs, searchClicked } = this.state
    return (
      <Container fluid={true}  className="center">
        <h2><u>Jobs</u></h2>
        <hr></hr>
        <Form>
          <Row>
            <Col className="center" md>
              <Form.Group controlId="">
                <Form.Label>Keyword Search</Form.Label>
                <Form.Control type="text" name="query" onChange={ this.handleInputChange.bind( this )} placeholder="e.g. Software Developer, NodeJs" />
              </Form.Group>          
            </Col>
            <Col className="center" md>
              <Form.Group controlId="">
                <Form.Label>City or Zip Code</Form.Label>
                <Form.Control type="text" name="location" onChange={ this.handleInputChange.bind( this )} placeholder="San Francisco, 94016" />
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
                <Button variant="dark" onClick={ this.getGitHubJobs.bind( this )} type="button">
                  Search
                </Button>
              }
            </Col>
          </Row>
        </Form>
        <hr></hr>
        <Row className="job-row">
          { jobs ? jobs.map(( job, index ) => {
            return (
              <Col key={ index } md="4" className="center">

                <div className="job-title">
                  <h4>{ job.title }</h4>
                </div>
                <div className="job-content">
                  <p><strong>Company:</strong> { job.company }  |  <strong>Location:</strong> { job.location }</p>
                </div>
                <Button type="button" className="btn" variant="dark" data-toggle="modal" data-target={`#modal${ index }`}>
                  Read More
                </Button>
                <div className="modal fade w-100" id={`modal${ index }`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalScrollableTitle">{ job.title }</h5>
                        <Button type="button" variant="dark" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </Button>
                      </div>
                      <div className="modal-body">
                        <Image src={ job.company_logo } thumbnail />
                        <p><strong>Company:</strong> { job.company }  |  <strong>Location:</strong> { job.location }</p>
                        <div className="job-description">
                          <div><strong>Description: </strong>{ parse(job.description) }</div>
                        </div>
                        <a className="btn btn-outline-dark" href={ job.link } target="_blank" rel="noopener noreferrer">Go To Posting</a>
                      </div>
                      <div className="modal-footer">
                        { job.shared || job.found ? 
                          job.found ?
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
                 <a className="btn btn-outline-dark" href={ job.url } target="_blank" rel="noopener noreferrer">Go To Posting</a>               
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
    
export default Jobs
    

    



    







































































































    


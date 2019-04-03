import React, { Component } from 'react';
import { Container, Button, Image, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import parse from 'html-react-parser';
import { parseJsonSourceFileConfigFileContent } from 'typescript';

require("./index.css");

export class Jobs extends Component {
  constructor(props){
    super(props);
    this.state = {
      jobs: [],
      interest: 'nodeJs',
      readMore: false,
      modalData: { title: "", description: "<div></div>", company: "", location: "" }
    }
  }

  componentDidMount = () => {
    this.getGitHubJobs();
  }

  handleModalShow = ( index ) => {
    const { jobs, readMore } = this.state

    this.setState({ readMore: !readMore, modalData: jobs[index] })
  }

  handleShareAction( index ) {
    const { jobs } = this.state
    const job = jobs[ index ]
    axios.post("/api/share/add", { type: "job", payload: job })
    .then( response => {
      console.log("job response", response)
    })
    .catch( err => {
      console.log('====err====', err)
    })
  }

  // Get GitHubJobs API.
  getGitHubJobs = async () => {
    let interest = this.state.interest;

    const jobs = await axios.get(`https://cors-anywhere.herokuapp.com/jobs.github.com/positions.json?description=${interest}&location=us`,{crossDomain: true})

    this.setState({
      jobs: jobs.data
    })
  }
    
  render() {
    const { jobs } = this.state
    return (
      <Container fluid={true}  className="center">
        <h2><u>Jobs</u></h2>
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
                          <p><strong>Description: </strong>{ parse(job.description) }</p>
                        </div>
                        <a className="btn btn-outline-dark" href={ job.link } target="_blank" rel="noopener noreferrer">Go To Posting</a>
                      </div>
                      <div className="modal-footer">
                        <Button className="btn" variant="dark" onClick={ this.handleShareAction.bind(this, index) }>Share</Button>    
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
    

    



    







































































































    


import React, { Component } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
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
    // axios.get("api/share/shared-items")
    // .then( payload => console.log('====payload====', payload) )
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
  // console.log(articles, events, jobs)
  return (
      <Container fluid={true} className="">        
        <h3>Shared items</h3>
        <hr></hr>
        {/* If sharing an article */}
        <Col>
          <h3>Articles</h3>
          <hr></hr>      
          { articles ? articles.map( (article, index) => {
            return (
              <div key={index} >
                {/* <p>"Profile pic"</p> */}
                <small>{article.user} shared an article</small>
                <a href={ article.url } target="_blank"><h5 className="">{ article.title }</h5></a>
                <div>
                  <Button size='sm' type="button" className="btn btn-dark">Like</Button>
                  <Button size='sm' type="button" className="btn btn-dark">Dislike</Button>
                  {/* <div className="useful">
                    {articles.foundUseful} found this useful.
                  </div> */}
                </div>
                <hr></hr>
              </div>              
            )
          }) : <div></div>}
        </Col>

        {/* If sharing an event */}
        <Col>
          <h3>Events</h3>
          <hr></hr>
          { events ? events.map( (event, index) => {            
            return (
              <div key={index}>
                {/* <p>"Profile pic"</p> */}
                <small>{event.user} shared an event</small>
                <a href={ event.link } target="_blank"><h5 className="">{ event.name }</h5></a>
                <small>{event.localized_location}</small>
                <div>
                  <Button size='sm' type="button" className="btn btn-dark">Like</Button>
                  <Button size='sm' type="button" className="btn btn-dark">Dislike</Button>
                  {/* <div className="useful">
                    {events.foundUseful} found this useful.
                  </div> */}
                </div>
                <hr></hr>
              </div>
            )
          }): <div></div>}
        </Col>

        {/* If sharing a job */}
        <Col>
          <h3>Jobs</h3>
          <hr></hr>
          { jobs ? jobs.map( (job, index) => {
            return (
              <div key={index}>
                {/* <p>"Profile pic"</p> */}
                <small>{job.user} shared a job</small>
                <a href={ job.url } target="_blank"><h5 className="">{ job.title }</h5></a>
                <small>Company: { job.company }  |  Location: { job.location }</small>
                <div>
                  <Button size='sm' type="button" className="btn btn-dark">Like</Button>
                  <Button size='sm' type="button" className="btn btn-dark">Dislike</Button>
                  {/* <div className="useful">
                    {jobs.foundUseful} found this useful.
                  </div> */}
                </div>
                <hr></hr>
              </div>
            )
          }): <div></div>}
        </Col>
      </Container>
      )
    }
  }
export default SharePage;

       
      
        // Like | Dislike a post
        // markUseful = (e) =>{      
        //   let share = this.state;
        //   let id = e.target.value;
        //   let newsFeed = share.articles.article
        //   let jobsFeed = share.jobs.job
        //   let eventsFeed = share.events.event
        //   const { articles, jobs, events } = this.state
      
        //    // If statement to find type
        //   if(share.articles){
        //     this.setState({
        //       articles: newsFeed.map(post => {
        //         if(id == post.url){
        //           if(articles.like == false && articles.dislike == false) {
        //             articles.foundUseful++;
        //             articles.like = true;
        //           }
        //           else if((articles.like == true && articles.dislike == true) || (articles.like == false && articles.dislike == true)){
        //             articles.foundUseful++;
        //             share[like] =true
        //             articles.like = true;
        //             articles.dislike = false;
        //           }
        //           else if(articles.like == true && articles.dislike == false){
        //             articles.foundUseful--;
        //             articles.like = false;
        //           }
        //         }
        //         return newsFeed;
        //       })
        //     })
        //   }
        //   else if(share.jobs){
        //     this.setState({
        //       jobs: jobsFeed.map(post => {
        //         if(id == post.url){
        //           if(jobs.like == false && jobs.dislike == false) {
        //             jobs.foundUseful++;
        //             jobs.like = true;
        //           }
        //           else if((jobs.like == true && jobs.dislike == true) || (jobs.like == false && jobs.dislike == true)){
        //             jobs.foundUseful++;
        //             jobs.like = true;
        //             jobs.dislike = false;
        //           }
        //           else if(jobs.like == true && jobs.dislike == false){
        //             jobs.foundUseful--;
        //             jobs.like = false;
        //           }
        //         }
        //         return jobsFeed;
        //       })
        //     })
        //   }
        //   else if(share.events){
        //     this.setState({
        //       events: eventsFeed.map(post => {
        //         if(id == post.link){
        //           if(events.like == false && events.dislike == false) {
        //             events.foundUseful++;
        //             events.like = true;
        //           }
        //           else if((events.like == true && events.dislike == true) || (events.like == false && events.dislike == true)){
        //             events.foundUseful++;
        //             events.like = true;
        //             events.dislike = false;
        //           }
        //           else if(events.like == true && events.dislike == false){
        //             events.foundUseful--;
        //             events.like = false;
        //           }
        //         }
        //         return eventsFeed;
        //       })
        //     })
        //   }
        // }
      
        // markNotUseful = (e) =>{
        //   let share = this.state;
        //   let id = e.target.value;
        //   let newsFeed = share.articles.article
        //   let jobsFeed = share.jobs.job
        //   let eventsFeed = share.events.event
        //   const { articles, jobs, events } = this.state
        //   // If statement to find type
        //   if(share.articles){
        //     console.log(id)
        //     this.setState({
        //       articles: newsFeed.map(post => {
        //         if(id == post.url){
        //           if(articles.like == false && articles.dislike == false) {
        //             articles.foundUseful--;
        //             articles.dislike = true;
        //           }
        //           else if((articles.like == true && articles.dislike == true) || (articles.like == true && articles.dislike == false)){
        //             articles.foundUseful--;
        //             articles.like = false;
        //             articles.dislike = true;
        //           }
        //           else if(articles.like == false && articles.dislike == true){
        //             articles.foundUseful++;
        //             articles.dislike = false;
        //           }
        //         }
        //         return newsFeed;
        //       })
        //     })
        //   }
        //   else if(share.jobs){
        //     this.setState({
        //       jobs: jobsFeed.map(post => {
        //         if(id == post.url){
        //           if(jobs.like == false && jobs.dislike == false) {
        //             jobs.foundUseful--;
        //             jobs.dislike = true;
        //           }
        //           else if((jobs.like == true && jobs.dislike == true) || (jobs.like == true && jobs.dislike == false)){
        //             jobs.foundUseful--;
        //             jobs.like = false;
        //             jobs.dislike = true;
        //           }
        //           else if(jobs.like == false && jobs.dislike == true){
        //             jobs.foundUseful++;
        //             jobs.dislike = false;
        //           }
        //         }
        //         return jobsFeed;
        //       })
        //     })
        //   }
        //   else if(share.events){
        //     this.setState({
        //       events: eventsFeed.map(post => {
        //         if(id == post.link){
        //           if(events.like == false && events.dislike == false) {
        //             events.foundUseful--;
        //             events.dislike = true;
        //           }
        //           else if((events.like == true && events.dislike == true) || (events.like == true && events.dislike == false)){
        //             events.foundUseful--;
        //             events.like = false;
        //             events.dislike = true;
        //           }
        //           else if(events.like == false && events.dislike == true){
        //             events.foundUseful++;
        //             events.dislike = false;
        //           }
        //         }
        //         return eventsFeed;
        //       })
        //     })
        //   }
        // }

      // If statement to verify the type of post shared
      // if(res.type == "article"){
      //   console.log("You are sharing a articles feed");      
      //   let { news } = this.state;
      //   // news.push({
      //   //   type: res.type,
      //   //   article: res.payload
      //   // });
      //   this.setState({
      //     news: {
      //       type: res.type,
      //       article: res.payload,
      //       like: false,
      //       dislike: false,
      //       foundUseful: 0
      //     }
      //   })
      // }
      // else if(res.type == "job"){
      //   console.log("You are sharing a job")
      //   let { jobs } = this.state;
      //   // jobs.push({
      //   //   type: res.type,
      //   //   job: res.payload
      //   // });

      //   this.setState({
      //     jobs: {
      //       type: res.type,
      //       job: res.payload,
      //       like: false,
      //       dislike: false,
      //       foundUseful: 0
      //     }
      //   })
      // }
      // else if(res.type == "event"){
      //   console.log("You are sharing an event")
      //   let { events } = this.state;
      //   // events.push({
      //   //   type: res.type,
      //   //   event: res.payload
      //   // });

      //   this.setState({
      //     events: {
      //       type: res.type,
      //       event: res.payload,
      //       like: false,
      //       dislike: false,
      //       foundUseful: 0
      //     }
      //   })
      // }
      // else {
      //   console.log('Unknown type')
      // }

    {/* <Row className="row1">
      {/* <Col  xs={6}>
        <Image src={shared.displayPicture} alt="profile-picture" rounded width="80px" height="50px"/>
      </Col> */}
      {/* <Col>
        <p className="username">{shared.username} shared.</p>
        
      </Col> }
      
    </Row> */}
{/*           
    <Row className="row2">
      <a className="shared-post" href={shared.url} target="_blank" rel="noopener noreferrer">
        <h5 className="title">{shared.title}</h5>
        <p className="description">{shared.description}</p>
      </a>
    </Row> */}

    {/* <div className="row3">
      <Button value={shared.url} onClick={this.markfoundUseful}>
        Like
      </Button>
      <Button value={shared.id} onClick={this.markNotUseful}>
        Dislike
      </Button>
      <div className="useful">
        {shared.foundUseful} found this useful.
      </div>
    </div> */}

import React, { Component } from 'react';
import { Image, Container, Row, Col, Button, Form, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import NewsAPI from 'newsapi';

require('./index.css')

const TechCrunch_API = '694a36dcc42a4cbf9922f6435b66ac77'
const newsapi = new NewsAPI(TechCrunch_API);

export class NewsFeeds extends Component {
  constructor(props){
    super(props);
    this.state = {
      articles: [],
      query: "",
      selectedCategory: "Category",
      searchClicked: false
    }
  }

  componentDidMount() {
    this.getNews()
  }
  // Get API for news feeds.
  getNews = async ( ) => {
    const { query, selectedCategory } = this.state
    this.setState({ searchClicked: true })
    const newQuery = query ? query : ""
    const payload = await newsapi.v2.topHeadlines({
      q: newQuery,
      category: selectedCategory !== "Category" ? selectedCategory : "technology",
      language: 'en',
      country: 'us'
    })
    this.setState({ 
      articles: payload.articles, 
      searchClicked: false 
    })
 }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleCategorySelect = event => {
    event.persist()
    const { innerText } = event.nativeEvent.srcElement
    this.setState({ selectedCategory: innerText })
  }

 handleShareAction = ( index ) => {
    const { articles } = this.state
    let article = articles[ index ]
    axios.post("/api/share/check-shared", { type: "article", payload: article.url })
    .then( response => {
      const { found } = response.data
      if( found ) { 
        let newArticles = articles
        article.found = true
        newArticles[ index ] = article

        return this.setState({ articles: newArticles }) 
      } else {
        axios.post("/api/share/add", { type: "article", payload: article })
        .then( response => {
          const { shared } = response.data
          if( shared ) { 
            let newArticles = articles
            article.shared = true
            newArticles[ index ] = article
            
            return this.setState({ articles: newArticles })            
          }
        })
      }      
    })    
    .catch( err => {
      console.log('====err====', err)
    })
  }

  render() {
    const { searchClicked, selectedCategory } = this.state
    return (
      <Container fluid={true} className="center">
        <h2><u>News Articles</u></h2>
        <hr></hr>
        <Form>   
          <Row>
            <Col>
              <Form.Group controlId="">
                <Form.Label>Keyword Search</Form.Label>
                <Form.Control type="text" name="query" onChange={ this.handleInputChange.bind( this )} placeholder="e.g. Apple" />
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    { selectedCategory }
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={ this.handleCategorySelect.bind( this )}>General</Dropdown.Item>                    
                    <Dropdown.Item onClick={ this.handleCategorySelect.bind( this )}>Technology</Dropdown.Item>                    
                    <Dropdown.Item onClick={ this.handleCategorySelect.bind( this )}>Business</Dropdown.Item>                    
                    <Dropdown.Item onClick={ this.handleCategorySelect.bind( this )}>Health</Dropdown.Item>                    
                    <Dropdown.Item onClick={ this.handleCategorySelect.bind( this )}>Science</Dropdown.Item>                    
                    <Dropdown.Item onClick={ this.handleCategorySelect.bind( this )}>Sports</Dropdown.Item>                    
                    <Dropdown.Item onClick={ this.handleCategorySelect.bind( this )}>Entertainment</Dropdown.Item>                    
                  </Dropdown.Menu>
                </Dropdown>
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
                <Button variant="dark" onClick={ this.getNews.bind( this )} type="button">
                  Search
                </Button>
              }
            </Col>
          </Row>       
        </Form>
        <hr></hr>
        <Row className="article-row">
          { this.state.articles ? this.state.articles.map( ( article, index ) => {
            return (
              <Col key={ index } md="4" className="article center">
                <h4 className="content">{ article.title }</h4>
                <small className="content">{ article.author }</small>
                { article.urlToImage ? <a target="_blank" href={ article.url }><Image src={ article.urlToImage } thumbnail /></a> : <div></div> }
                <a target="_blank" href={ article.url }><u>Click To View Article</u></a>        
                { article.shared || article.found ? 
                    article.found ?
                    <h3><strong>Already Shared</strong></h3>
                    :
                    <h3><strong>Shared</strong></h3>
                  :
                  <Button className="btn" variant="dark" onClick={ this.handleShareAction.bind(this, index) }>Share</Button> 
                } 
                <hr></hr>
              </Col>
            )}) : <div><br></br><h4 className="center">Loading...</h4><br></br></div>          
          }
        </Row>
      </Container>
    )
  }
}

export default NewsFeeds

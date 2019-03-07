import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import NewsFeeds from '../NewsFeeds';
import Jobs from '../Jobs';
import Events from '../Events';
import './index.css';

// import Container from 'react-bootstrap/Container';
// import Col from 'react-bootstrap/Col'
// import Row from 'react-bootstrap/Row'

class Home extends Component {

  render() {
    
    return(
      <div className='home'>
        <div className = "">
            <div className='news'>
                <NewsFeeds />
            </div>

            <div className='jobs'>
                <Jobs/>
            </div>

            <div className='events'>
                <Events />
            </div> 
            <Link to="/profile">Profile</Link>
        </div>
      </div>
    );
  }    
}

export default Home;
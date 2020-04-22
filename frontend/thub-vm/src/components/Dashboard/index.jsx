import React, { Component } from "react";
import './style.scss';
import DashboardChild from "./dashboard"
import { Container, Col, Row } from 'react-bootstrap'; 
import t_hub_logo from '../../assets/t-hub-logo.png';
import axios from 'axios'; 

const SERVER_URL = process.env.REACT_APP_DEV_API_URL + "/visitor";
const token = localStorage.getItem('token')
const options = {
    headers: {'Authorization': 'Bearer ' + token}
  };


export class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {visitors: []}
    }
    
      
    componentDidMount() {
         axios.get(SERVER_URL,options )
      .then(res => {
        this.setState({ visitors : res.data.data });
        console.log(this.state.visitors)
      }, (error) => {
        console.log(error);
      });
    }

    render() {
        return ( 
            <Container className="dashboard-layout"> 
                <Row>   
                    <Col>  
                    <img src={t_hub_logo} alt="t_hub_logo" className="logo-style"/>
                    </Col>
                    
                </Row> 
                <Row>
                    <Col >
                        <DashboardChild visitors={this.state.visitors}/>
                    </Col>
                </Row>
            </Container>
            
        )
    }
}

export default Dashboard;

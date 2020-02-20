import React, { Component, Fragment } from 'react'
import LoginForm from './LoginForm'; 
import './style.css';
import { Container, Col, Row, Image } from 'react-bootstrap'; 
import t_hub_logo from '../../../assets/t-hub-logo.png';
export class Login extends Component {
    render() {
        return ( 
            <Container className="login-form-layout"> 
                <Row>   
                    <Col>  
                    <img src={t_hub_logo} alt="t_hub_logo" className="logo-style"/>
                    </Col>
                    
                </Row> 
                <Row>
                    <Col >
                        <LoginForm/>
                    </Col>
                </Row>
            </Container>
            
        )
    }
}

export default Login;

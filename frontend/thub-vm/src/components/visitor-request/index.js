import React, { Component, Fragment } from 'react'
import './style.css';
import { Container, Col, Row } from 'react-bootstrap'; 
import t_hub_logo from '../../assets/t-hub-logo.png';
import VisitorRequestForm from './VisitorRequestForm';
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
                    <Col xs="6" >
                        <VisitorRequestForm/>
                    </Col>
                </Row>
            </Container>
            
        )
    }
}

export default Login;

import React, { Component } from 'react'; 
import { Form, Button, Card, Alert } from 'react-bootstrap'; 
import axios from 'axios'; 

const SERVER_URL = "http://localhost:3000/login" 
const CODE_MAX_VALUE = 9999;
const CODE_MIN_VALUE = 1000; 
const USERNAME_MIN_LENGTH = 4; 
const PASSWORD_MIN_LENGTH =  8;

export class LoginForm extends Component { 
    constructor(props){ 
        super(props); 
        this.state={ 
            username:'', 
            password:'', 
            resp : null, 
            status : 'rejected', 
            code : null, 
            isLoggedIn:false, 
            errorOccured : false, 
            validationError :  false, 
            validationMessage : ''
        }
    } 
    onUserNameEntered = (event) =>{ 
        this.setState({ 
            username:event.target.value
        })
    } 
    onPasswordEnterd = (event) => { 
        this.setState({ 
            password:event.target.value
        })
    }  
    generateSecretCode=(max=CODE_MAX_VALUE, min=CODE_MIN_VALUE)=>{
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; 
    } 
    formValidation = () => {
        if(this.state.username.length > USERNAME_MIN_LENGTH){ 
            console.log("Username satisfied");
            if(this.state.password.length > PASSWORD_MIN_LENGTH){ 
                console.log("password satisfied"); 
                this.setState({  
                    validationError: false,  
                    validationMessage : ''
                    })
                return true;
            } 
            else{   
                this.setState({  
                    validationError: true,  
                    validationMessage : 'Username or Password Incorrect'
                    })
                    return false; 
            }
        }else { 
            this.setState({  
                validationError: true,  
                validationMessage : 'Username or Password Incorrect'
                })
        return false; 
        } 
    }
    onFormSubmit = () =>{   
        if(this.formValidation()){ 
            const response = { 
                username : this.state.username, 
                password : this.state.password, 
                code : this.generateSecretCode(), 
                status : this.state.status, 
            } 
            console.log(response);
            axios.post(`${SERVER_URL}`,response) 
            .then(res => this.setState({isLoggedIn:true})) 
            .catch(err=> this.setState({errorOccured:true}))
            console.log("Submit clicked");
        }
    } 
    render() {
            if(!this.state.isLoggedIn){  
                return( 
                    <div> 
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>Login</Card.Title>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control  
                                        type="email"  
                                        placeholder="Enter email"  
                                        value = {this.state.username}  
                                        onChange = {(e)=> this.onUserNameEntered(e)}  
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Control  
                                        type="password"  
                                        placeholder="Password"  
                                        value = {this.state.password}  
                                        onChange = {(e)=> this.onPasswordEnterd(e)}    
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={this.onFormSubmit}>
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body> 
                    </Card>   
                    { this.state.validationError && 
                        <Alert variant = "warning" className="alert-dialog-style" >  
                            {this.state.validationMessage}
                        </Alert>
                    }
                    {this.state.errorOccured &&  
                    <Alert variant = "danger" className="alert-dialog-style" >  
                        Something went wrong! Please try again later.
                    </Alert>
                        }
                </div>
                ); 
            } 
            else {  
                return(  
                <Alert variant="success" className="alert-dialog-style">  
                    Successfully LoggedIn
                </Alert>
                )
            } 

    }
}

export default LoginForm

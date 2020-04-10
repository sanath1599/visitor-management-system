import React, { Component } from 'react'; 
import { Form, Button, Card, Alert, FormControl } from 'react-bootstrap';  
import * as Yup from 'yup';
import axios from 'axios'; 
import { Redirect } from 'react-router-dom';

const SERVER_URL = "http://localhost:3005/api/auth/login" 
const CODE_MAX_VALUE = 9999;
const CODE_MIN_VALUE = 1000; 
const PASSWORD_MIN_LENGTH =  8; 

const schema = Yup.object().shape({ 
    email : Yup.string().email("Enter Proper Email").required("Email is Required"), 
    password : Yup.string().required("Password is required")
})

export class LoginForm extends Component { 
    constructor(props){ 
        super(props); 
        this.state={ 
            email:'', 
            password:'', 
            resp : null, 
            status : 'rejected', 
            code : null, 
            isLoggedIn:false, 
            errorOccured : false, 
            validationError :  false, 
            validationMessage : '', 
            userId : null
        }
    } 
    onUserNameEntered = (event) =>{ 
        this.setState({ 
            email:event.target.value
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
        schema.isValid({ 
            email:this.state.email, 
            password:this.state.password
        }).then((valid)=>{  
            if(valid)
            return true; 
            else 
            return false;
        }).catch((err)=>{ 
            this.setState({ 
                validationError:true, 
                validationMessage:'Enter proper email and password'
            }) 
            return false;
        })
    }

    saveToken = (response) => {  
        localStorage.setItem('token', response.data.token); 
        this.updateStateWithUserdId(response);
    } 
    updateStateWithUserdId = (response ) => {
        this.setState({ 
            userId : response.data._id
        })
    }   
    onFormSubmit = () =>{     
        console.log("Button Clicked");
        if(this.formValidation()){  
            const response = { 
                email : this.state.email, 
                password : this.state.password, 
                code : this.generateSecretCode(), 
                status : this.state.status, 
            } 
            axios.post(`${SERVER_URL}`,response) 
            .then(res => this.saveToken(res.data)) 
            .then(<Redirect
                        to={{
                            pathname: "/dashboard",
                            state: { userId : this.state.userId }
                        }}
                    />)
            .catch(err=> this.setState({errorOccured:true}))
            console.log("Submit clicked");
        }
    }
    render() {
            if(!this.state.isLoggedIn){  
                return( 
                    <div> 
                    <Card style={{ width: '35rem', maxWidth:'600px' }}>
                        <Card.Body>
                            <Card.Title>Login</Card.Title>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control  
                                        type="email"  
                                        placeholder="Enter email"  
                                        value = {this.state.email}  
                                        onChange = {(e)=> this.onUserNameEntered(e)}  
                                    /> 
                                    <FormControl.Feedback type="invalid">Enter Proper Email</FormControl.Feedback>
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

export default LoginForm;

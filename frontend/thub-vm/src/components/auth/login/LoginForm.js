import React, { Component } from 'react'; 
import { Form, Button, Card, Alert, FormControl } from 'react-bootstrap';  
import * as Yup from 'yup';
import axios from 'axios'; 
import { Redirect } from 'react-router-dom';

const SERVER_URL = process.env.REACT_APP_DEV_API_URL + "/auth/login";
const CODE_MAX_VALUE = 9999;
const CODE_MIN_VALUE = 1000; 

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
            userId : null, 
            redirect:false
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
            if(valid){ 
                const response = { 
                    email : this.state.email, 
                    password : this.state.password, 
                    code : this.generateSecretCode(), 
                    status : this.state.status, 
                } 
                axios.post(`${SERVER_URL}`,response) 
                .then(res => this.saveToken(res.data)) 
                .then(resp=>{console.log(resp); this.setState({ redirect : true })}) //add additional check here based on the response received from the server
                .catch(err=> {  
                        if(!err.response)
                        this.setState({errorOccured:true})  
                        else 
                        this.setState({validationError:true, 
                                        validationMessage: 'Email or Password incorrect'})
                    
                    })
            }else { 
                this.setState({ 
                    validationError:true, 
                    validationMessage:'Enter proper email and password'
                }) 
            }
        }).catch((err)=>{ 
            this.setState({ 
                validationError:true, 
                validationMessage:'Enter proper email and password'
            }) 
            return false;
        }) 
}

    saveToken = (response) => {   
        console.log(!!response.data.token);
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
        this.formValidation();
    }
    render() { 
            if(this.state.redirect){  
                return(
                <Redirect
                            to={{
                                pathname: "/dashboard",
                                state: { userId : this.state.userId }
                            }}
                        /> 
                )
            }else { 
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
}

export default LoginForm;

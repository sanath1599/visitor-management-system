import React, { Component } from 'react'; 
import { Form, Button, Card, Alert } from 'react-bootstrap'; 
import axios from 'axios'; 

const SERVER_URL = "http://localhost:3000/new-visitor"; 

const minLength = { 
    name : 5, 
    mobileNumber : 10,
    startupName:3,
    contactPerson:4,
    reason:5,
    duration:1,
} 

const formFields = ["name", "mobileNumber", "startupName", "contactPerson", "reason", "duration"]

export class VisitorRequestForm extends Component { 
    constructor(props){ 
        super(props); 
        this.state={ 
            name:null, 
            mobileNumber:null, 
            email:null,  
            startupName:null, 
            contactPerson:null,  
            reason:null, 
            duration:null, 
            resp : null, 
            errorOccured : false, 
            validationError :  false, 
            validationMessage : ''
        }
    } 
    isFieldEmpty=(fieldIndex)=>{
        if(this.state[formFields[fieldIndex]] === null)
            return false; 
        else 
            return true;
    } 
    areAllFieldsFilled = () => {
        for (let index = 0; index < formFields.length; index++) {
                if(!this.isFieldEmpty(index)){
                    if(this.state[formFields[index]].length > minLength[formFields[index]]){
                        return true;
                    }
                } 
                else {  
                    return false;
                }
        }
}
    formValidation = () => { 
        if(!this.areAllFieldsFilled()){
            this.setState({
                validationError:true, 
                validationMessage:"Please fill all the required fields Properly"
            }) 
            return false;
        }  
        this.setState({
            validationError:false, 
            validationMessage:""
        }) 
        return true; 
    }
    onFormSubmit = () =>{    
        console.log("Button Clicked");
        if(this.formValidation()){ 
            const response = { 
                name : this.state.name,  
                mobileNumber : this.state.mobileNumber, 
                email : this.state.email, 
                startupName : this.state.startUpName,  
                contactPerson : this.state.contactPerson, 
                reason : this.state.reason,  
                duration : this.state.duration
            } 
            console.log(response);
            axios.post(`${SERVER_URL}`,response) 
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
                            <Card.Title>Visitor Request Form</Card.Title>
                            <Form>
                                <Form.Group controlId="formBasicName">
                                    <Form.Control  
                                        type="text"  
                                        placeholder="Enter Name"  
                                        value = {this.state.name}  
                                        onChange = {(e)=> this.setState({ name : e.target.value })}  
                                    />
                                </Form.Group> 
                                <Form.Group controlId="formBasicMobileNumber">
                                    <Form.Control  
                                        type="numeric"  
                                        placeholder="Enter Mobile Number"  
                                        value = {this.state.mobileNumber}  
                                        onChange = {(e)=> this.setState({ mobileNumber : e.target.value })}  
                                    />
                                </Form.Group> 
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control  
                                        type="email"  
                                        placeholder="Enter Email"  
                                        value = {this.state.email}  
                                        onChange = {(e)=> this.setState({ email : e.target.value })}  
                                    />
                                </Form.Group> 
                                <Form.Group controlId="formBasicStartUpName">
                                    <Form.Control  
                                        type="text"  
                                        placeholder="Enter Startup Name"  
                                        value = {this.state.startupName}  
                                        onChange = {(e)=> this.setState({ startupPerson : e.target.value })}  
                                    />
                                </Form.Group> 
                                <Form.Group controlId="formBasicContactPerson">
                                    <Form.Control  
                                        type="text"  
                                        placeholder="Contact Person at Startup"  
                                        value = {this.state.contactPerson}  
                                        onChange = {(e)=> this.setState({ contactPerson : e.target.value })}  
                                    />
                                </Form.Group> 
                                <Form.Group controlId="formBasicReasonForVisit">
                                    <Form.Control  
                                        type="text"  
                                        placeholder="Enter Reason For Visit"  
                                        value = {this.state.reason}  
                                        onChange = {(e)=> this.setState({ reason : e.target.value })}  
                                    />
                                </Form.Group> 
                                <Form.Group controlId="formBasicDurationForVisit">
                                    <Form.Control  
                                        type="text"  
                                        placeholder="Enter Duration of Visit"  
                                        value = {this.state.duration}  
                                        onChange = {(e)=> this.setState({ duration : e.target.value })}  
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

export default VisitorRequestForm;

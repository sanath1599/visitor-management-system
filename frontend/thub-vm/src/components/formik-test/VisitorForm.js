import React from 'react'; 
import { Form, Button, Card } from 'react-bootstrap';  
import { useFormik } from 'formik'; 
import * as Yup from 'yup'; 



const formValidationSchema =  Yup.object({ 
    name : Yup.string().required().min(3,"Please enter your full name"),
    mobileNumber: Yup.string()
                    .matches(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,"Please enter your 10 digit mobile number ")
                    .required(),
    email: Yup.string().email().required(),
    startupName: Yup.string().required(),
    contactPerson: Yup.string().required(),
    reason: Yup.string().required(),
    duration: Yup.number()
                .required()
})


export  default function  VisitorForm(){     

    const formik = useFormik({ 
        initialValues:{ 
            name:'',
            mobileNumber:'',
            email:'',
            startupName:'', 
            contactPerson:'', 
            reason:'',
            duration:'',
            errorOccured:'',
            validationError:'',
            validationMessage:''
        }, 
        validationSchema:()=> formValidationSchema,
        onSubmit: values => { 
            alert(JSON.stringify(values, null, 2));
        }
    });
                console.log(formik.errors);
                return( 
                        <div>
                        <Card style={{ width: '35rem', maxWidth:'600px' }}>
                            <Card.Body>
                                <Card.Title>Formik Test</Card.Title>  
                                <Form noValidate  onSubmit={formik.handleSubmit}>
                                    <Form.Group controlId="formBasicName">
                                        <Form.Control  
                                            type="text"  
                                            required  
                                            name="name"
                                            placeholder="Enter Name"  
                                            value = {formik.values.name}  
                                            onChange = {formik.handleChange}   
                                            isInvalid={!!formik.errors.name} 
                                            isValid={formik.touched.name && !formik.errors.name}
                                        /> 
                                        <Form.Control.Feedback></Form.Control.Feedback> 
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group> 
                                    <Form.Group controlId="formBasicMobileNumber">
                                        <Form.Control  
                                            type="numeric"  
                                            required  
                                            name="mobileNumber"
                                            placeholder="Enter Mobile Number"  
                                            value = {formik.values.mobileNumber}  
                                            onChange = {formik.handleChange}   
                                            isInvalid={!!formik.errors.mobileNumber} 
                                            isValid={formik.touched.mobileNumber && !formik.errors.mobileNumber}
                                        /> 
                                        <Form.Control.Feedback></Form.Control.Feedback> 
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.mobileNumber}
                                        </Form.Control.Feedback>
                                    </Form.Group> 
                                    <Form.Group controlId="formBasicEmail"> 
                                        <Form.Control  
                                            type="email"   
                                            required 
                                            name="email"
                                            placeholder="Enter Email"  
                                            value = {formik.values.email}  
                                            onChange = {formik.handleChange}   
                                            isInvalid={!!formik.errors.email} 
                                            isValid={formik.touched.email && !formik.errors.email}
                                        /> 
                                        <Form.Control.Feedback></Form.Control.Feedback> 
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group> 
                                    <Form.Group controlId="formBasicStartUpName">
                                        <Form.Control  
                                            type="text" 
                                            required   
                                            name="startupName"
                                            placeholder="Enter Startup Name"  
                                            value = {formik.values.startupName}  
                                            onChange = {formik.handleChange}   
                                            isInvalid={!!formik.errors.startupName}  
                                            isValid={!formik.errors.startupName && formik.touched.startupName}
                                        /> 
                                        <Form.Control.Feedback></Form.Control.Feedback> 
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.startupName}
                                        </Form.Control.Feedback>
                                    </Form.Group>  
                                    <Form.Group controlId="formBasicContactPerson">
                                        <Form.Control  
                                            type="text"   
                                            required 
                                            name="contactPerson"
                                            placeholder="Contact Person at Startup"  
                                            value = {formik.values.contactPerson}  
                                            onChange = {formik.handleChange}   
                                            isInvalid={!!formik.errors.contactPerson} 
                                            isValid={formik.touched.contactPerson && !formik.errors.contactPerson}
                                        /> 
                                        <Form.Control.Feedback></Form.Control.Feedback> 
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.contactPerson}
                                        </Form.Control.Feedback>
                                    </Form.Group> 
                                    <Form.Group controlId="formBasicReasonForVisit">
                                        <Form.Control  
                                            type="text"   
                                            required 
                                            name="reason"
                                            placeholder="Enter Reason For Visit"  
                                            value = {formik.values.reason}  
                                            onChange = {formik.handleChange}   
                                            isInvalid={!!formik.errors.reason} 
                                            isValid={formik.touched.reason && !formik.errors.reason}
                                        /> 
                                        <Form.Control.Feedback></Form.Control.Feedback> 
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.reason}
                                        </Form.Control.Feedback>
                                    </Form.Group> 
                                    <Form.Group controlId="formBasicDurationForVisit">
                                        <Form.Control  
                                            type="text"   
                                            required 
                                            name="duration"
                                            placeholder="Enter Duration of Visit"  
                                            value = {formik.values.duration}  
                                            onChange = {formik.handleChange}  
                                            isInvalid={!!formik.errors.duration} 
                                            isValid={formik.touched.duration && !formik.errors.duration} 
                                        /> 
                                        <Form.Control.Feedback></Form.Control.Feedback> 
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.duration}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Button type="submit" >
                                        Submit
                                    </Button>
                                </Form>   
                            </Card.Body> 
                        </Card>   
                    </div>
                )} 
            

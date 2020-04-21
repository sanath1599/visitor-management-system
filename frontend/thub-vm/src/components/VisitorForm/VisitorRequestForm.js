import React, { useState} from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup"; 
import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_DEV_API_URL + '/visitor';

const formValidationSchema = Yup.object({
    visitor: Yup.string().required()
                .min(3, "Please enter your full name"),
    phone: Yup.string()
        .matches(
        /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
        "Please enter your 10 digit mobile number "
        )
        .required(),
    startup_email: Yup.string().email().required(),
    startupName: Yup.string().required(),
    contactPerson: Yup.string().required(),
    description: Yup.string().required(),
    time: Yup.number().required("Enter single digit number of hours of visit time"),
    email:Yup.string().email().required()
});

export default function VisitorRequestForm() { 
    const [validated, setvalidated] = useState(false)

    const formik = useFormik({
        initialValues: {
            visitor: "",
            phone: "",
            startup_email: "",
            startupName: "",
            contactPerson: "",
            description: "",
            time: "", 
            email:"",
            errorOccured: "",
            validationError: "",
            validationMessage: ""
        }, 
        validationSchema: () => formValidationSchema,
        onSubmit: values => {  
            axios.post(SERVER_URL,values);
        }
    }); 
    return (
        <div>
        <Card style={{ width: "35rem", maxWidth: "600px" }}>
            <Card.Body>
            <Card.Title className="text-center">Visitor Form</Card.Title>
            <Form noValidate  onSubmit={formik.handleSubmit}>
                <Form.Group controlId="formBasicName">
                <Form.Control
                    type="text"
                    required
                    name="visitor"
                    placeholder="Enter Name"
                    value={formik.values.visitor}
                    onChange={formik.handleChange}
                    isInvalid={ validated && !!formik.errors.visitor}
                    isValid={  validated && formik.touched.visitor && !formik.errors.visitor}
                /> 
                <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                    {formik.errors.visitor}
                    </Form.Control.Feedback> 
                
                </Form.Group>
                <Form.Group controlId="formBasicMobileNumber">
                <Form.Control
                    type="numeric"
                    required
                    name="phone"
                    placeholder="Enter Mobile Number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    isInvalid={validated && !!formik.errors.phone}
                    isValid={
                        validated && formik.touched.phone && !formik.errors.phone
                    }
                />
                <Form.Control.Feedback></Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                    {formik.errors.phone}
                </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicStartUpEmail">
                <Form.Control
                    type="startup_email"
                    required
                    name="startup_email"
                    placeholder="Enter Startup Email"
                    value={formik.values.startup_email}
                    onChange={formik.handleChange}
                    isInvalid={ validated && !!formik.errors.startup_email}
                    isValid={ validated && formik.touched.startup_email && !formik.errors.startup_email}
                />
                <Form.Control.Feedback></Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                    {formik.errors.startup_email}
                </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicStartUpName">
                <Form.Control
                    type="text"
                    required
                    name="startupName"
                    placeholder="Enter Startup Name"
                    value={formik.values.startupName}
                    onChange={formik.handleChange}
                    isInvalid={ validated && !!formik.errors.startupName}
                    isValid={
                        validated &&  !formik.errors.startupName && formik.touched.startupName
                    }
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
                    value={formik.values.contactPerson}
                    onChange={formik.handleChange}
                    isInvalid={ validated && !!formik.errors.contactPerson}
                    isValid={
                        validated && formik.touched.contactPerson && !formik.errors.contactPerson
                    }
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
                    name="description"
                    placeholder="Enter Reason For Visit"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    isInvalid={ validated && !!formik.errors.description}
                    isValid={validated && formik.touched.description && !formik.errors.description}
                />
                <Form.Control.Feedback></Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                    {formik.errors.description}
                </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicDurationForVisit">
                <Form.Control
                    type="text"
                    required
                    name="time"
                    placeholder="Enter Duration of Visit"
                    value={formik.values.time}
                    onChange={formik.handleChange}
                    isInvalid={ validated && !!formik.errors.time}
                    isValid={ validated && formik.touched.time && !formik.errors.time}
                />
                <Form.Control.Feedback></Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                    {formik.errors.time}
                </Form.Control.Feedback>
                </Form.Group> 
                <Form.Group controlId="formBasicEmail">
                <Form.Control
                    type="email"
                    required
                    name="email"
                    placeholder="Enter your Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    isInvalid={validated && !!formik.errors.email}
                    isValid={validated && formik.touched.email && !formik.errors.email}
                />
                <Form.Control.Feedback></Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                </Form.Control.Feedback>
                </Form.Group> 
                <div className="text-center">  
                <Button type="submit" onClick={()=>setvalidated(true)} >Submit</Button>
                </div>
            </Form>
            </Card.Body>
        </Card>
        </div>
    );
    }

import React from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup"; 
import axios from 'axios';

const SERVER_URL = 'http://localhost:3000/newvisitor'

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
    time: Yup.number().required(),
    email:Yup.string().email().required()
});

export default function VisitorRequestForm() {
    const formik = useFormik({
        initialValues: {
            visitor: "",
            phone: "",
            startup_email: "",
            startupName: "",
            contactPerson: "",
            description: "",
            time: "",
            errorOccured: "",
            validationError: "",
            validationMessage: ""
        }, 
        validationSchema: () => formValidationSchema,
        onSubmit: values => {
            axios.post(SERVER_URL,values);
        }
    }); 

    console.log(formik.errors);
    return (
        <div>
        <Card style={{ width: "35rem", maxWidth: "600px" }}>
            <Card.Body>
            <Card.Title>Visitor Form</Card.Title>
            <Form noValidate onSubmit={formik.handleSubmit}>
                <Form.Group controlId="formBasicName">
                <Form.Control
                    type="text"
                    required
                    name="visitor"
                    placeholder="Enter Name"
                    value={formik.values.visitor}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.visitor}
                    isValid={formik.touched.visitor && !formik.errors.visitor}
                />
                <Form.Control.Feedback></Form.Control.Feedback>
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
                    isInvalid={!!formik.errors.phone}
                    isValid={
                    formik.touched.phone && !formik.errors.phone
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
                    isInvalid={!!formik.errors.startup_email}
                    isValid={formik.touched.startup_email && !formik.errors.startup_email}
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
                    isInvalid={!!formik.errors.startupName}
                    isValid={
                    !formik.errors.startupName && formik.touched.startupName
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
                    isInvalid={!!formik.errors.contactPerson}
                    isValid={
                    formik.touched.contactPerson && !formik.errors.contactPerson
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
                    isInvalid={!!formik.errors.description}
                    isValid={formik.touched.description && !formik.errors.description}
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
                    isInvalid={!!formik.errors.time}
                    isValid={formik.touched.time && !formik.errors.time}
                />
                <Form.Control.Feedback></Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                    {formik.errors.time}
                </Form.Control.Feedback>
                </Form.Group> 
                <Form.Group controlId="formBasicEmail">
                <Form.Control
                    type="text"
                    required
                    name="email"
                    placeholder="Enter your Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.email}
                    isValid={formik.touched.email && !formik.errors.email}
                />
                <Form.Control.Feedback></Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit">Submit</Button>
            </Form>
            </Card.Body>
        </Card>
        </div>
    );
    }

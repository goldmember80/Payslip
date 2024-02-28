import './App.css'
import { Image, Alert, Button, Container, Row, Col, Form, Table, Stack } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
    const [items, setItems] = useState([])
    const [inputs, setInputs] = useState({
        FirstName: '',
        LastName: '',
        Annual: 0,
        SuperRate: 0,
        PayPeriod: ''
    })

    const renderAddContent = () => {
        return (
            <Container>
                <h1>Employee Details:</h1>
                <Form.Group as={Row} className="mb-3" controlId="formAddItem">
                    <Form.Label column sm="3">
                        First Name:
                    </Form.Label>
                    <Col md="2">
                        <Form.Control type="text" name="FirstName" onChange={handleTextChange} />
                    </Col>
                    <Form.Label column sm="3">
                        Last Name:
                    </Form.Label>
                    <Col md="2">
                        <Form.Control type="text" name="LastName" onChange={handleTextChange} />
                    </Col>
                    <Form.Label column sm="3">
                        Annual Salary:
                    </Form.Label>
                    <Col md="2">
                        <Form.Control type="text" name="Annual" onChange={handleTextChange} />
                    </Col>
                    <Form.Label column sm="3">
                        Super Rate (%):
                    </Form.Label>
                    <Col md="2">
                        <Form.Control type="text" name="SuperRate" onChange={handleTextChange} />
                    </Col>
                    <Form.Label column sm="3">
                        Pay Period:
                    </Form.Label>
                    <Col md="2" className="align-self-center">
                        <select name="PayPeriod" className="custom-dropdown" onChange={handleDropdownChange}>
                            <option value="">Select...</option>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 offset-md-2" controlId="formAddTodoItem">
                    <Stack direction="horizontal" gap={3}>
                        <Button variant="primary" onClick={() => handleCal()}>
                            Calculate
                        </Button>
                        {/*<Button variant="secondary" onClick={() => handleClear()}>*/}
                        {/*    Clear*/}
                        {/*</Button>*/}
                    </Stack>
                </Form.Group>
            </Container>
        )
    }

    const renderPaySlipContent = () => {
        return (
            <>
                <h1>
                    Showing {items.length} Item(s){' '}
                    <Button variant="primary" className="pull-right" onClick={() => handleClear()}>
                        Clear
                    </Button>
                </h1>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Period</th>
                            <th>Gross Income</th>
                            <th>Income Tax</th>
                            <th>Net Income</th>
                            <th>Super</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.fullName}</td>
                                <td>{item.payPeriod}</td>
                                <td>{item.grossIncome}</td>
                                <td>{item.incomeTax}</td>
                                <td>{item.netIncome}</td>
                                <td>{item.super}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </>
        )
    }

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }));
    }
    const handleDropdownChange = (e) => {
        const { name, value } = e.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }));
    }

    //var webapi = "https://localhost:5064/api/Calculator";
    var webapi = "https://webapipayslip.azure-api.net"; 

    const subscriptionKey = 'ded1fd7b1692415f9069559a614b4a16';
    const headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey
    };

    async function getItems() {
        axios.get(webapi, { headers }).then(function (res) {
            setItems(res.data);
            console.log(res);
        }).catch(function (error) {
            console.error(error);
        });
    }

    async function handleCal() {
        //setItems([...items, item]);
        axios.post(webapi, inputs, { headers }).then(function (res) {
                getItems();
                console.log(res);
        }).catch(function (error) {
            console.error(error);
        });
    }

    async function handleClear() {
        axios.delete(webapi, { headers }).then(function (res) {
            getItems();
            console.log(res);
        }).catch(function (error) {
            console.error(error);
        });
    }

    return (
        <div className="App">
            <Container>
                <Row>
                    <Col>{renderAddContent()}</Col>
                </Row>
                <br />
                <Row>
                    <Col>{renderPaySlipContent()}</Col>
                </Row>
            </Container>
            <footer className="page-footer font-small teal pt-4">
                <div className="footer-copyright text-center py-3">
                    2024.2.14 by Tan Ke
                </div>
            </footer>
        </div>
    )
}

export default App
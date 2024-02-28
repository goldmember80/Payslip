import './App.css'
import { Image, Button, Container, Row, Col, Form, Table, Stack } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
    const [items, setItems] = useState([])
    const [calculating, setCalculating] = useState(false);
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
                <br/>
                <Row>
                    <Col>
                        <div className="rectangle">
                            <ul>
                                <li>This is a demo web for calculating progressive individual income tax.</li>
                                <li>The frontend is generated using React and deployed on GitHub Pages,
                                    while the backend is an ASP.net Core WebAPI deployed on Azure.</li>
                                <li>Source Code: <a href="https://github.com/goldmember80/Payslip"> https://github.com/goldmember80/Payslip </a> </li>
                                <li className="small-text">
                                    * May take a few seconds at the first time request due to free Azure server performance :p
                                </li>
                            </ul>
                        </div>
                    </Col>
                </Row>
                <br />
                <br />
                <div className="all">
                    <div className="left">
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
                        <Form.Group as={Row} className="mb-3 offset-md-4" controlId="formAddTodoItem" justifyContent="right">
                            <Stack direction="horizontal" gap={3}>
                                <Button variant="primary" disabled={calculating} onClick={() => handleCal()}>
                                    {calculating ? 'Calculating...' : 'Calculate'}
                                </Button>
                                {/*<Button variant="secondary" onClick={() => handleClear()}>*/}
                                {/*    Clear*/}
                                {/*</Button>*/}
                            </Stack>
                            </Form.Group>
                    </div>
                    <div className="right">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Taxable income</th>
                                    <th>Tax rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Up to $14,000</td>
                                    <td>10.5%</td>
                                </tr>
                                <tr>
                                    <td>Over $14,000 and up to $48,000</td>
                                    <td>17.5%</td>
                                </tr>
                                <tr>
                                    <td>Over $48,000 and up to $70,000</td>
                                    <td>30%</td>
                                </tr>
                                <tr>
                                    <td>Over $70,000 and up to $180,000</td>
                                    <td>33%</td>
                                </tr>
                                <tr>
                                    <td>Remaining income over $180,000</td>
                                    <td>39%</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
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

    //const subscriptionKey = '';
    //const headers = {
    //    'Content-Type': 'application/json',
    //    'Ocp-Apim-Subscription-Key': subscriptionKey
    //};

    async function getItems() {
        axios.get(webapi).then(function (res) {
            setItems(res.data);
            console.log(res);
        }).catch(function (error) {
            console.error(error);
        });
    }

    async function handleCal() {
        //setItems([...items, item]);
        setCalculating(true);
        axios.post(webapi, inputs).then(function (res) {
                getItems();
                setCalculating(false);
                console.log(res);
        }).catch(function (error) {
            setCalculating(false);
            console.error(error);
        });
    }

    async function handleClear() {
        axios.delete(webapi).then(function (res) {
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
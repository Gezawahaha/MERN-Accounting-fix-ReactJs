

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import FormBiaya from "../partials/FormInputBiaya";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import axios from "axios";
import ReactDatatable from '@ashvin27/react-datatable';

import { NavLink } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';
//import CurrencyInput from '../partials/CurencyInput';
import Currency from 'react-currency-input-field';

import ReactSelect from "react-select";
import styled from 'styled-components';
import MaskedInput from 'react-text-mask'


import '../style/FormBiaya.css';
//smantic
//import { Grid, Segment , Form , Card, HeaderContent , Table ,Button} from 'semantic-ui-react';
//import { FormGroup , TextField } from "@material-ui/core";


//Bootsrap
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup'

const options=[
    {  name: "Tatang", alamat: "Jln Pusaka raya blok c 3 depan rumah surya insomnia" ,  Rek: "BCA 1231232564" },
    {  name: "David", value: "Gg. Dolly tempat prostitusi paling terkenal sejagad raya", Rek: "BCA 0841122564" }
  ]




class BiayaForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pay_from_account_number: "",
            beneficiary: "",
            transaction_date: "",
            payment_method: '',
            expense_no: '',
            tags: '',
            billing_address: '',
            created_at: '',
            updated_at: '',

            //Simpan
            BayarDari: [],
            AkunBiaya:[],
            items: [],
            errors: {}
        };

        this.state = {
            currentRecord: {
                pay_from_account_number: "",
                beneficiary: '',
                transaction_date: '',
                payment_method: '',
                expense_no: '',
                tags: '',
                billing_address: '',
                created_at: '',
                updated_at: ''
            }
        };


        
    }

    onBiayaAdd = e => {
        e.preventDefault();
        const newBiaya = {
            
        };
        console.log("submit",newBiaya);
    };

    onChangeBayarDari = e => {  
        //this.setState({ [e.target.id]: e.target.value });
        this.setState({
            pay_from_account_number: e.name,
        })
        console.log("Bayar Dari",this.state.pay_from_account_number);
    };

    onChangeJumlah = e => {  
        
        console.log("MASOKKKK",e);
    };

    componentDidMount() {
        this.getDataBayardari();
        this.getDataAkunBiaya();
        //console.log("test",this.state.records.value);
    };

    getDataAkunBiaya() {
        axios.get('/coa/main/sub/Sub-data')
            .then(res => {
                this.setState({ 
                    AkunBiaya: res.data,
                    
                })
                console.log("Akun Biaya", this.state.AkunBiaya);
            })
            .catch()
            this.getDataAkunBiaya = this.getDataAkunBiaya.bind(this);
    }

    getDataBayardari() {
        axios.get('/coa/main/sub/1/1')
            .then(res => {
                this.setState({ 
                    BayarDari: res.data,
                    
                })
                //console.log("Bayar Dari Data", this.state.BayarDari);
            })
            .catch()
            this.getDataBayardari = this.getDataBayardari.bind(this);
    }
   
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
        console.log(e);
    };



    render() {
        const { user } = this.props.auth;
        return (
            <div>
            
                <Navbar />
                <div className="d-flex" id="wrapper">
                <Sidebar/>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-2" id="menu-toggle"><FontAwesomeIcon icon={faList}/></button>
                            <h1 className="mt-2 text-primary">Buat Biaya</h1>
                            <Card body>
                                <Form noValidate onSubmit={this.onBiayaAdd}>
                                    <Form.Row>
                                        <Form.Group as={Col} >
                                            <Form.Label>Bayar Dari</Form.Label>
                                            <ReactSelect
                                                onChange={this.onChangeBayarDari} 
                                                className="SizeSelect"
                                                getOptionValue={option => option._id}
                                                getOptionLabel={option => option.name}
                                                options={this.state.BayarDari}
                                                />
                                        </Form.Group>

                                        <Form.Group as={Col} >
                                            <Form.Label>Penerima</Form.Label>
                                            <ReactSelect 
                                                getOptionValue={option => option.name}
                                                getOptionLabel={option => option.name}
                                                options={options}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} >
                                            <Form.Label>Tgl Transaksi</Form.Label>
                                            <Form.Control type="date"/>
                                        </Form.Group>
                                        <Form.Group as={Col} >
                                            <Form.Label>Cara Bayar</Form.Label>
                                            <ReactSelect
                                                className="col-md-12 size-select"
                                                getOptionValue={option => option.name}
                                                getOptionLabel={option => option.Rek}
                                                options={options}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col}  >
                                            <Form.Label>No Biaya</Form.Label>
                                            <Form.Control placeholder="XXX/XXX/XXX"/>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Group as={Col} xs={6}>
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control as="textarea" />
                                    </Form.Group>

                                    <br/>
                                    <br/>

                                    <Table responsive="sm">
                                        <thead>
                                            <tr>
                                                <th>Akun Biaya</th>
                                                <th>Deskripsi</th>
                                                <th>Pajak</th>
                                                <th>Jumlah</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <ReactSelect
                                                        getOptionValue={option => option.name}
                                                        getOptionLabel={option => option.Rek}
                                                        options={options}
                                                    />
                                                </td>
                                                <td><Form.Control type="text" /></td>
                                                <td><Form.Control type="text" /></td>
                                                <td>
                                                    <InputGroup className="mb-3">
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text>Rp. </InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        
                                                            <Currency className="form-control CurencySelect" onChange={this.onChangeJumlah}
                                                            />

                                                        <InputGroup.Append>
                                                            <InputGroup.Text>.00</InputGroup.Text>
                                                        </InputGroup.Append>
                                                    </InputGroup>
                                                </td>
                                                {/* <td><Form.Control type="text" onChange={ this.onChangeJumlah }/></td> */}
                                            </tr>
                                        </tbody>
            
                                    </Table>

                                    <Form.Group as={Col} xs={5}>
                                        <Form.Label>Memo</Form.Label>
                                        <Form.Control as="textarea" />
                                    </Form.Group>

                                    <div>
                                        <br/>
                                        <br/>
                                    </div>
                                    
                                    <div className="invoice-price">
                                        <div className="invoice-price-left">
                                            <div className="invoice-price-row">
                                                <div className="sub-price">
                                                    <small>SUBTOTAL</small>
                                                    <span class="text-inverse"><CurrencyFormat value={10000} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></span>
                                                </div>

                                                {/* Jika ada pajak otomatis akan ada dan + pajak 
                                                <div class="sub-price">
                                                    <i class="fa fa-plus text-muted"></i>
                                                </div>
                                                <div class="sub-price">
                                                    <small>PPN</small>
                                                    <span class="text-inverse"><CurrencyFormat value={1000} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></span>
                                                </div>
                                                 */}
                                            </div>
                                        </div>
                                        <div className="invoice-price-right">
                                            <small>TOTAL</small> <span class="f-w-600"><CurrencyFormat value={11000} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></span>
                                        </div>
                                    </div>

                                    <div>
                                        <br/>
                                        <br/>
                                    </div>
                                    <Row>
                                        <Col></Col>
                                        <Col md="auto">
                                            <Button variant="primary" type="submit">
                                                Submit
                                            </Button>
                                        </Col>
                                        <Col xs lg="2">
                                            <Button variant="danger" type="close">
                                                Cancel
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>

                            </Card>
                            <Card.Footer><small>this form made by iosys</small></Card.Footer>

                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}

BiayaForm.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(BiayaForm);

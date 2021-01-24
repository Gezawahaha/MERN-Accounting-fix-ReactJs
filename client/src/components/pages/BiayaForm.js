

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

import ReactSelect from "react-select";
import styled from 'styled-components';

import '../style/FormBiaya.css';
//smantic
import { Grid, Segment , Form , Card, HeaderContent , Table ,Button} from 'semantic-ui-react';
import { FormGroup , TextField } from "@material-ui/core";


const options=[
    {  name: "Tatang", alamat: "Jln Pusaka raya blok c 3 depan rumah surya insomnia" },
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
            updated_at: ''
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

        this.state ={
            RecordAkunBiaya: [],
            RecordAkunAktiva: []
        };

        this.state = {
            BayarDari: [],
            AkunBiaya:[],
            items: [],
            errors: {}
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
            pay_from_account_number: e._id,
        })
        console.log("Bayar Dari",this.state.pay_from_account_number);
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
                            <Card.Group>
                                <Card fluid color='red' header='B' background="light" className="col-lg-10 center">
                                   <div className="card-in">
                                        <Form noValidate onSubmit={this.onBiayaAdd} >
                                               
                                            <Form.Group>
                                                <Form.Input width={4} label='Bayar Dari'>
                                                    <ReactSelect
                                                        onChange={this.onChangeBayarDari}
                                                        className="col-md-12 size-select"
                                                        getOptionValue={option => option}
                                                        getOptionLabel={option => option.name}
                                                        options={this.state.BayarDari}
                                                    />        
                                                </Form.Input>
                                            </Form.Group>
                                        
                                            <Form.Group>
                                                <Form.Input placeholder='2 Wide' width={4} label='Penerima'>
                                                    <ReactSelect
                                                        className="col-md-12 size-select"
                                                        getOptionValue={option => option.name}
                                                        getOptionLabel={option => option.name}
                                                        options={options}
                                                    />        
                                                </Form.Input>
                                                <Form.Input placeholder='12 Wide' width={4} label='Tgl Transaksi' type="date"/>
                                                <Form.Input placeholder='2 Wide' width={4} label='Cara Bayar'>
                                                <ReactSelect
                                                        className="col-md-12 size-select"
                                                        getOptionValue={option => option.name}
                                                        getOptionLabel={option => option.name}
                                                        options={options}
                                                    />
                                                </Form.Input>
                                                <Form.Input placeholder='' width={4} label='No Biaya'/>
                                            </Form.Group>
                                            <Form.Group >
                                                <Form.TextArea width={6} label='Alamat Penagihan'/>
                                            </Form.Group>
                                            
                                            <br/>
                                            <br/>
                                            <br/>

                                            <Table compact>
                                                <Table.Header>
                                                    <Table.Row>
                                                        <Table.HeaderCell>Akun Biaya</Table.HeaderCell>
                                                        <Table.HeaderCell>Deskripsi</Table.HeaderCell>
                                                        <Table.HeaderCell>Pajak</Table.HeaderCell>
                                                        <Table.HeaderCell>Jumlah</Table.HeaderCell>
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    <Table.Row>
                                                        <Table.Cell>
                                                            <ReactSelect/>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Form.Input type="text"/>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <ReactSelect />
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Form.Input type="text"/>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            </Table>

                                            <br/>
                                            <br/>
                                            <br/>

                                            <div className="row">
                                                <div className="col-lg-6 col-lg-pull-6">
                                                    <Form.TextArea width={12} label='Memo'/>

                                                </div>
                                                <div className="col-lg-6 col-lg-push-6">
                                                    <div className="row">
                                                        <div className="col-md-3">
                                                            <h2>Sub Total</h2>
                                                            <h1>Total</h1>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <a><CurrencyFormat value={10000} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></a>
                                                            <h1><CurrencyFormat value={10000} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h1>
                                                        </div>
                                                    </div>
                                                    <br/>
                                                    <br/>
                                                    <div className="row">
                                                        
                                                        <Button color='red'>Batal</Button>
                                                        <Button color='green' type="submit" >Buat Biaya Baru</Button>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                                
                                            
                                        </Form>
                                    </div>
                                </Card>
                                <Card fluid color='orange' header='Option 2' />
                                <Card fluid color='yellow' header='Option 3' />
                            </Card.Group>
                            
                            
                            


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

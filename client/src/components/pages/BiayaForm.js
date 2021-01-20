

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
    { key: "m", name: "Male", value: "male" },
    { key: "f", name: "Female", value: "female" }
  ]

const FormExampleWidthField = () => (

        <Form>
        
        <Form.Group>
            <Form.Input label='Bayar Dari' width={6}>
               
            </Form.Input>
        </Form.Group>
        <Form.Group>
            <Form.Input placeholder='2 Wide' width={2} />
            <Form.Input placeholder='12 Wide' width={12} />
            <Form.Input placeholder='2 Wide' width={2} />
        </Form.Group>
        <Form.Group>
            <Form.Input placeholder='8 Wide' width={8} />
            <Form.Input placeholder='6 Wide' width={6} />
            <Form.Input placeholder='2 Wide' width={2} />
        </Form.Group>
        </Form>
    
  )



class BiayaForm extends Component {

    constructor(props) {
        super(props);


        this.state = {
            currentRecord: {
                id: '',
                coa_account_number: '',
                name: '',
                total_debit: '',
                total_kredit: '',
                created_at: '',
                updated_at: ''
            }
        };

        this.state ={
            RecordAkunBiaya: [],
            RecordAkunAktiva: []
        };

        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        //this.getData();
        //console.log("test",this.state.records.value);
    };


    getData() {
        axios.get('')
            .then(res => {
                this.setState({ 
                    records: res.data,
                    
                })
                console.log("DK", this.state.records);
            })
            .catch()
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
                                <Card fluid color='red' header='B' background="light" >
                                   <div className="card-in">
                                        <Form>
                                               
                                            <Form.Group>
                                                <Form.Input width={4} label='Bayar Dari'>
                                                    <ReactSelect
                                                        className="col-md-12 size-select"
                                                        getOptionValue={option => option.value}
                                                        getOptionLabel={option => option.name}
                                                        options={options}
                                                    />        
                                                </Form.Input>
                                            </Form.Group>
                                        
                                            <Form.Group>
                                                <Form.Input placeholder='2 Wide' width={4} label='Penerima'>
                                                    <ReactSelect
                                                        className="col-md-12 size-select"
                                                        getOptionValue={option => option.value}
                                                        getOptionLabel={option => option.name}
                                                        options={options}
                                                    />        
                                                </Form.Input>
                                                <Form.Input placeholder='12 Wide' width={4} label='Tgl Transaksi' type="date"/>
                                                <Form.Input placeholder='2 Wide' width={4} label='Cara Bayar'/>
                                                <Form.Input placeholder='2 Wide' width={4} label='No Biaya'/>
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
                                                        <Form>
                                                        <Button color='red'>Batal</Button>
                                                        <Button color='green' >Buat Biaya Baru</Button>
                                                        </Form>
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

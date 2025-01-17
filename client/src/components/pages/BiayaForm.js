

import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import FormBiaya from "../partials/FormInputBiaya";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import axios from "axios";

import { NavLink } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';

import { toast } from 'react-toastify';
import ReactSelect from "react-select";
import styled from 'styled-components';
import MaskedInput from 'react-text-mask'

import { addBiaya } from "../../actions/userActions";


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
import InputGroup from 'react-bootstrap/InputGroup';
import moment from 'moment';

const options=[
    {  name: "Tatang", alamat: "Jln Pusaka raya blok c 3 depan rumah surya insomnia" ,  Rek: "BCA 1231232564" },
    {  name: "David", value: "Gg. Dolly tempat prostitusi paling terkenal sejagad raya", Rek: "BCA 0841122564" }
  ]

  
const carabayar=[
    {  name: "Transfer"},
    {  name: "Cash"}
  ]

  const TaxOpt=[
    {  b: 0, name: "no tax...",  rate: 0  },
    {  b: 1, name: "PPN",  rate: 10/100 },
    {  b: 1, name: "PPH 21",  rate: 5/100  }
  ]

    


class BiayaForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            //expense
            pay_from_account_number: '',
            beneficiary: '',
            transaction_date: '',
            payment_method: '',
            expense_no: '',
            tags: '',
            billing_address: '',
            created_at: '',
            updated_at: '',

            //expense Detail
            expenses_account: '',
            main_account_number: '',
            sub_account_number: '',
            description: '',
            tax: '',
            expenses_amount: '',
            created_at: '',
            link_id: '',


            //Simpanan
            BayarDari: [],
            AkunBiaya:[],
            items: [],
            Penerima: [],
            errors: {},

            TaxName: '',
            TaxRate: 0.00,
            TaxB: 0,
            AmountTax: 0,
            expenses: 0 
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
            pay_from_account_number: this.state.pay_from_account_number,
            beneficiary: this.state.beneficiary,
            transaction_date: moment(this.state.transaction_date).format("YYYY-MM-DD HH:mm:ss"),
            payment_method: this.state.payment_method,
            expense_no: this.state.expense_no,
            tags: this.state.tags,
            billing_address: this.state.billing_address,
            expenses_detail:[{
                expenses_account: this.state.expenses_account,
                description: this.state.description,
                tax: this.state.AmountTax,
                expenses_amount: this.calcGrandTotal(),
                main_account_number: this.state.main_account_number,
                coa_account_number: this.state.coa_account_number
            }]
        };
        console.log("submit",newBiaya);
        this.props.addBiaya(newBiaya , this.props.history);
        toast("Waiting For Load Data", {
            position: toast.POSITION.TOP_CENTER
        });
    };

    onChangeBayarDari = e => {  
        //this.setState({ [e.target.id]: e.target.value });
        console.log("C",e);
        if ( e.main_account_number < 10 && e.sub_account_number < 10 ){
            this.setState({
                pay_from_account_number: `${e.coa_account_number}-0${e.main_account_number}-0${e.sub_account_number}`
            })
        }else if ( e.main_account_number < 10 && e.sub_account_number >= 10){
            this.setState({
                pay_from_account_number: `${e.coa_account_number}-0${e.main_account_number}-${e.sub_account_number}`
            })
        }else if ( e.main_account_number >= 10 && e.sub_account_number < 10){
            this.setState({
                pay_from_account_number: `${e.coa_account_number}-${e.main_account_number}-0${e.sub_account_number}`
            })
        }else if ( e.main_account_number >= 10 && e.sub_account_number >= 10){
            this.setState({
                pay_from_account_number: `${e.coa_account_number}-${e.main_account_number}-${e.sub_account_number}`
            })
        }
        
    };

    onChangeDate = e => {  
        this.setState({
            transaction_date: e.target.value,
        })
        console.log("Date",this.state.transaction_date);
    };

    onChangePenerima= e => {  
        this.setState({
            beneficiary: e.FirstName,
            billing_address: e.Address
        })
        //console.log("Penerima",this.state.beneficiary);
        //console.log("Isi dari tax",this.state.expenses_amount);
        console.log("Masok",this.state.expenses_amount);
    };

    onChangePayMethod= e => {
        this.setState({
            payment_method: e
        })
    };

    onChangeExpenseNO= e => {
        this.setState({
            expense_no: 1
        })
    };

    onChangeDeskripsi = e => {  
        this.setState({
            description: e.target.value,
        })
        //console.log("Desc",this.state.description);
    };

    onChangeAkunBiaya = e => {
        this.setState({
            expenses_account: e.sub_account_number,
            main_account_number: e.main_account_number,
            coa_account_number: e.coa_account_number
        })
    };

    onChangeTax = e => {  
        this.setState({
            TaxName: e.name,
            TaxRate: e.rate,
            TaxB: e.b,
            
        })
        this.calcTaxTotal();
        this.calcGrandTotal();
        
    };

    

    calcTaxTotal = () => { 
        if (this.state.expenses > 0){
            
            return   ( this.state.expenses * this.state.TaxRate  ) 
        }
        return 0
        
       
    };

    calcGrandTotal = () => {
        if (this.state.expenses > 0){
            //console.log("Masok")
            if(this.state.TaxB == 1){
                
                return  (this.state.expenses * 1) + (this.state.AmountTax * 1)
            }
            return this.state.expenses
        }
        return 0
    }

    componentDidMount() {
        this.getDataBayardari();
        this.getDataAkunBiaya();
        this.getDataPenerima();
        //console.log("test",this.state.records.value);
         
        
    };

    getDataAkunBiaya() {
        axios.get('/coa/main/sub/6')
            .then(res => {
                this.setState({ 
                    AkunBiaya: res.data,
                    
                })
                //console.log("Akun Biaya", this.state.AkunBiaya);
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

    getDataPenerima() {
        axios.get('/employee/Emp-data')
            .then(res => {
                this.setState({ 
                    Penerima: res.data,
                    
                })
                console.log("Penerima", this.state.Penerima);
            })
            .catch()
            this.getDataPenerima = this.getDataPenerima.bind(this);
    };
   
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
                            <Card body bg="info" >
                                        <Form.Label><h5 className="font-hebbo">Pilih Bayar Dari</h5></Form.Label>
                                        <Form.Group as={Col} >
                                            <ReactSelect
                                                onChange={this.onChangeBayarDari} 
                                                className="SizeSelect"
                                                getOptionValue={option => option}
                                                getOptionLabel={option => option.name}
                                                options={this.state.BayarDari}
                                                />
                                        </Form.Group>
                            </Card>
                            <br/>
                            <div className="flex-container">
                            <Card body className="card-form">
                                <Form noValidate onSubmit={this.onBiayaAdd}>
                                    <Form.Row>
                                        <Form.Group as={Col} >
                                            <Form.Label>Penerima</Form.Label>
                                            <ReactSelect
                                                onChange={this.onChangePenerima} 
                                                getOptionValue={option => option.FirstName}
                                                getOptionLabel={option => option.FirstName}
                                                options={this.state.Penerima}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} >
                                            <Form.Label>Tgl Transaksi</Form.Label>
                                            <Form.Control 
                                                type="date" 
                                                onChange={this.onChangeDate} 
                                                />
                                        </Form.Group>
                                        <Form.Group as={Col} >
                                            <Form.Label>Cara Bayar</Form.Label>
                                            <ReactSelect
                                                className="col-md-12 size-select"
                                                onChange={ this.onChangePayMethod }
                                                getOptionValue={option => option.name}
                                                getOptionLabel={option => option.name}
                                                options={carabayar}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col}  >
                                            <Form.Label>No Biaya</Form.Label>
                                            <Form.Control placeholder="XXX/XXX/XXX auto" onChange={ this.onChangeExpenseNO }/>
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
                                                        onChange= {this.onChangeAkunBiaya}
                                                        getOptionValue={option => option.name}
                                                        getOptionLabel={option => option.name}
                                                        options={this.state.AkunBiaya}
                                                    />
                                                </td>
                                                <td><Form.Control type="text" onChange={this.onChangeDeskripsi} /></td>
                                                <td>
                                                <ReactSelect
                                                        onChange={this.onChangeTax}
                                                        getOptionValue={option => option}
                                                        getOptionLabel={option => option.name}
                                                        options={TaxOpt}
                                                    />
                                                </td>
                                                <td>
                                                    <InputGroup className="mb-3">
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text>Rp. </InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        
                                                            <CurrencyFormat 
                                                                className="form-control" 
                                                                //onChange={this.onChangeJumlah}
                                                                thousandSeparator={ true }
                                                                isNumericString={true}
                                                                onValueChange={(values) => {
                                                                        const {formattedValue, value} = values;
                                                                        this.setState({
                                                                            expenses:  value * 1,
                                                                            AmountTax: value * this.state.TaxRate,
                                                                            //expenses_amount: this.state.expenses + this.state.AmountTax
                                                                        })
                                                                        this.calcGrandTotal();  
                                                                    }
                                                                }                                                            

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
                                                    <span className="text-inverse">
                                                        <CurrencyFormat 
                                                            value={ this.state.expenses } 
                                                            displayType={'text'} 
                                                            thousandSeparator={true} 
                                                            prefix={'Rp. '} 
                                                            
                                                            />
                                                    </span>
                                                </div>

                                                 
                                                 { this.state.TaxB == 1 &&(
                                                    <Fragment>
                                                        <div className="sub-price">
                                                            <i className="fa fa-plus text-muted"></i>
                                                        </div>
                                                        <div className="sub-price">
                                                            <small>{this.state.TaxName}</small>
                                                            <span className="text-inverse">
                                                                <CurrencyFormat 
                                                                    
                                                                    value={ this.calcTaxTotal() } 
                                                                    displayType={'text'} 
                                                                    thousandSeparator={true}
                                                                    isNumericString={true} 
                                                                    prefix={'Rp. '} 
                                                                    // onValueChange={(values) => {
                                                                    //     const {formattedValue, value} = values;
                                                                    //     this.setState({
                                                                    //         AmountTax: this.calcTaxTotal() ,

                                                                    //     })
                                                                    //     console.log("Masoookkk2", this.state.AmountTax);
                                                                    // }
                                                                    // }       

                                                                    />
                                                            </span>
                                                        </div>
                                                        
                                                    </Fragment>
                                                 )}
                                            </div>
                                        </div>
                                        <div className="invoice-price-right">
                                            <small>TOTAL</small> <span className="f-w-600">
                                                <CurrencyFormat 
                                                    //onchange={ this.onChangeJumlah } 
                                                    value={  this.calcGrandTotal() } 
                                                    displayType={'text'} 
                                                    thousandSeparator={true} 
                                                    prefix={'Rp. '} 

                                                    />
                                            </span>
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
                                            <Button variant="danger" type="reset" >
                                                Reset
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                                <br/>
                                <Card.Footer><small>this form made by iosys</small></Card.Footer>                                
                            </Card>
                            
                            </div>                               
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

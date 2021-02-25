import React, { Component, Fragment } from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPelunasan  } from "../../../actions/userActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import axios from "axios";

import 'react-toastify/dist/ReactToastify.css';
import '../../style/FormBiaya.css';

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
import ReactSelect from "react-select";
import CurrencyFormat from 'react-currency-format';



class BayarAddModal extends React.Component {
    locale = 'en-US'
    currency = 'IDR'

    constructor() {
        super();
        this.state = {    
            //Purchase
            supplierID:'',
            coa_account_number:'',
            sub_account_number:'',
            main_account_number:'',
            no_purchase:'',
            purchaseDate:'',
            dueDate: '',
            total_amount_purchase:'',
            status: 0,
            keterangan:'',

            //bayar
            InvoiceID:'',
            nomor_bukti:'',
            amount:'',
            Date: '',
            description:'',
            link_id:'', //Buku bank
            purchaseID:'', //purchaseID

            //SIMPENAN
            BayarDari: [],
            InvActive:[]
        
        };

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }     

    }

   

    //SUBMITPOSTT HERE
    onBayarAdd = e => {
        //console.log(this.state.lineItems);
        e.preventDefault();
        const newPembayaran = {
            nomor_bukti: this.state.nomor_bukti,
            amount: this.state.amount,
            date: this.state.date,
            description: this.state.description,
            link_id: this.state.link_id,
            purchaseID: this.state.purchaseID   
        }
        console.log(newPembayaran);
        this.props.addPelunasan(newPembayaran, this.props.history);
        $('#add-bayar-modal').modal('hide');
            toast("Waiting For Load Data", {
                position: toast.POSITION.TOP_CENTER
            });
    };
  
    
    onChangeDate = e => {  
        this.setState({
            date: moment( e.target.value ).format("YYYY-MM-DD HH:mm:ss"),
        })
        //console.log("Date",this.state.transaction_date);
    };
    

    onchangeNo = e =>{
        this.setState({
            nomor_bukti: e.target.value
        })
    }

    onchangeKet = e =>{
        this.setState({
            description: e.target.value
        })
    }

    onChangeInv = e => {
        this.setState({purchaseID: e.purchaseID})
    }

    onChangeBayarDari = e => {
        if ( e.name == "Bank BCA"){
            this.setState({link_id: 2})
        }else if (e.name == "Bank Mandiri"){
            this.setState({link_id: 1})
        }
        console.log( this.state.purchaseID )
        
    }

    componentDidMount() {
        this.getDataBayardari();
        this.getDataInvoice();
    }

    getDataBayardari() {
        axios.get('/coa/main/sub/1/2')
            .then(res => {
                this.setState({ 
                    BayarDari: res.data,
                    
                })
                //console.log("Bayar Dari Data", res.data[0].name);
            })
            .catch()
            this.getDataBayardari = this.getDataBayardari.bind(this);
    }

    getDataInvoice() {
        axios.get('/purchase/purchase-data')
            .then( response => {
                let result=[];
                response.data.forEach((req) => {
                    if (req.status == 0) {      
                        result.push(req);     
                    }
                     
                })
                this.setState({InvActive: result})
                console.log(result)
            })
            .catch()
            
    }

 

    render() {
        const { errors } = this.state;
        return (
            <div>
                <div className="modal fade" id="add-bayar-modal" data-reset="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Pembayaran</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onBayarAdd} id="add-bayar" >
                                    <Card body bg="secondary" >
                                        <Form.Label><h5 className="font-hebbo">Bayar Dari</h5></Form.Label>
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
                                                <Form.Row>
                                                    <Form.Group as={Col}  >
                                                        <Form.Label>Invoice</Form.Label>
                                                        <ReactSelect
                                                            onChange={this.onChangeInv} 
                                                            className="SizeSelect"
                                                            getOptionValue={option => option}
                                                            getOptionLabel={option => `${option.no_purchase} || Rp.${option.total_amount_purchase}`}
                                                            options={this.state.InvActive}
                                                            />
                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={4}>
                                                    <Form.Label>No Bukti</Form.Label>
                                                    <Form.Control type="text" onChange={this.onchangeNo}/>
                                                    
                                                    </Form.Group>
                                                </Form.Row>

                                                <br/>
                                                <Form.Row>
                                                    <Form.Group as={Col} width={100}>
                                                        <Form.Label>Tgl Transaksi</Form.Label>
                                                        <Form.Control 
                                                            type="date" 
                                                            onChange={this.onChangeDate} 
                                                            />
                                                    </Form.Group>
                                                    
                                                    <Form.Group as={Col}>
                                                        <Form.Label>Jumlah</Form.Label>
                                                        <InputGroup >
                                                            <InputGroup.Prepend>
                                                                <InputGroup.Text>Rp. </InputGroup.Text>
                                                            </InputGroup.Prepend>
                                        
                                                            <CurrencyFormat
                                                                className="form-control"
                                                                isNumericString={ true }
                                                                thousandSeparator={ true }
                                                                onValueChange={(values) => {
                                                                const {formattedValue, value} = values;
                                                                this.setState({amount: value * 1})}}
                                                            />
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Form.Row>
                                                <br/>
                                                

                                                <Form.Group as={Col} xs={5}>
                                                    <Form.Label>Keterangan</Form.Label>
                                                    <Form.Control as="textarea" onChange={this.onchangeKet}/>
                                                    <br/>
                                                    <br/>
                                                </Form.Group>

                                            </Card>
                                                </div>
                                            <br/>
                                            <Card.Footer><small>this form made by iosys</small></Card.Footer>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="add-bayar"
                                    type="submit"
                                    className="btn btn-primary">
                                    Tambah Transaksi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

BayarAddModal.propTypes = {
    addPelunasan : PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addPelunasan  }
)(withRouter(BayarAddModal));

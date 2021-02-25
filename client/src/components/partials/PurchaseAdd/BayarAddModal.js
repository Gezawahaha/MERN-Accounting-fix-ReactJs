import React, { Component, Fragment } from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPurchase } from "../../../actions/userActions";
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

            Supplier:[],


            TaxName: '',
            TaxRate: 0.00,
            TaxB: 0,
            AmountTax: 0,
            expenses: 0 
        };

        this.state = {
            taxRate: 0.00,
            lineItems: [
              {
                id: '',      // react-beautiful-dnd unique key
                name: '',
                coa_account_number: '',
                main_account_number: '',
                sub_account_number: '',
                item_desc: '',
                qty: 1,
                price: 0.00,
                total_price: 0.00
              },
            ]
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }     

    }

   

    //SUBMITPOSTT HERE
    onPurchaseAdd = e => {
        //console.log(this.state.lineItems);
        e.preventDefault();
        const newPurchase = {
            supplierID: parseInt(this.state.supplierID),
            no_purchase: this.state.no_purchase,
            purchaseDate: this.state.purchaseDate,
            dueDate: this.state.dueDate,
            keterangan: this.state.keterangan,
            coa_account_number: this.state.coa_account_number,
            main_account_number: this.state.main_account_number,
            sub_account_number: this.state.sub_account_number,
           
            purchase_detail: this.state.lineItems
            
            
        }
        console.log(newPurchase);
        this.props.addPurchase(newPurchase, this.props.history);
        $('#add-biaya-modal').modal('hide');
            toast("Waiting For Load Data", {
                position: toast.POSITION.TOP_CENTER
            });
    };
  
    
    onChangeDate = e => {  
        this.setState({
            purchaseDate: moment( e.target.value ).format("YYYY-MM-DD HH:mm:ss"),
        })
        //console.log("Date",this.state.transaction_date);
    };
    onChangeDueDate = e => {  
        this.setState({
            dueDate: moment( e.target.value ).format("YYYY-MM-DD HH:mm:ss"),
        })
        //console.log("Date",this.state.transaction_date);
    };

    onChangeNo = e =>{
        this.setState({
            no_purchase: e.target.value
        })
    }

    onchangeKet = e =>{
        this.setState({
            keterangan: e.target.value
        })
    }

    onChangeSupplier = async e => {
        //Get Main Acoount Lenght
        try {
            let response = await axios.get("/coa/main/sub/2/1");
          
            for (let index = 0; index < response.data.length; index++) {
                if (response.data[index].name == e.CompanyName) {
                    this.setState({
                        coa_account_number: response.data[index].coa_account_number,
                        main_account_number: response.data[index].main_account_number,
                        sub_account_number: response.data[index].sub_account_number,
                        supplierID: e.SupplierID
                    })
                    //console.log(response.data[index].coa_account_number,"-" ,response.data[index].main_account_number,"-" ,response.data[index].sub_account_number);
                }
                //
            }
            
          } catch (err) {}
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
                                <form noValidate onSubmit={this.onPurchaseAdd} id="add" >
                                    <Card body bg="secondary" >
                                        <Form.Label><h5 className="font-hebbo">Bayar Dari</h5></Form.Label>
                                        <Form.Group as={Col} >
                                            <ReactSelect
                                                onChange={this.onChangeSupplier} 
                                                className="SizeSelect"
                                                getOptionValue={option => option}
                                                getOptionLabel={option => option.CompanyName}
                                                options={this.state.Supplier}
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
                                                            onChange={this.onChangeSupplier} 
                                                            className="SizeSelect"
                                                            getOptionValue={option => option}
                                                            getOptionLabel={option => option.CompanyName}
                                                            options={this.state.Supplier}
                                                            />
                                                    </Form.Group>
                                                </Form.Row>

                                                
                                                <br/>
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
                                                                this.setState({})}}
                                                            />
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Form.Row>
                                                <br/>
                                                

                                                <Form.Group as={Col} xs={5}>
                                                    <Form.Label>Description</Form.Label>
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
                                    form="add"
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
    addPurchase: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addPurchase }
)(withRouter(BayarAddModal));

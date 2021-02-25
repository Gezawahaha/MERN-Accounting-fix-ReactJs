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

//line items
import LineItems from './LineItems';
import uuidv4 from 'uuid/v4';



class PembelianAddModal extends React.Component {
    locale = 'en-US'
    currency = 'IDR'

    constructor() {
        super();
        this.state = {
            //expense
            pay_from_account_number: '',
            beneficiary: '',
            transaction_date: '',
            payment_method: '',
            expense_no: '',
            tags: '',
            billing_address: '',
            total_expense_amount: '',
            created_at: '',
            updated_at: '',

            
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
            BiayaData:[],
            errors: {},
            
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
            total_amount_purchase: this.calcGrandTotal(),
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

    
  handleInvoiceChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleLineItemChange = (elementIndex ) => (event) => {
    
    let lineItems = this.state.lineItems.map((item, i) => {
      if (elementIndex !== i) return item
      return {...item, [event.target.name]: event.target.value}
    })
    this.setState({lineItems})
  }

  handleLineItemAkun = (elementIndex) => (event) => {

    let lineItems = this.state.lineItems.map((item, i) => {
      if (elementIndex !== i) return item
      return {...item, sub_account_number: event.sub_account_number, main_account_number: event.main_account_number, coa_account_number: event.coa_account_number, name: event.name, tax: 0}
    })
    this.setState({lineItems})
    //console.log(this.state.lineItems);
  }

  handleLineItemPrice = (elementIndex, qtyORprice ) => (event) => {
    
    let lineItems = this.state.lineItems.map((item, i) => {
      if (elementIndex !== i) return item
      return {...item, [event.target.name]: event.target.value * 1 , total_price: qtyORprice * event.target.value}
    })
    this.setState({lineItems})
    //console.log(lineItems)
  }

  handleAddLineItem = (event) => {
    this.setState({
      // use optimistic uuid for drag drop; in a production app this could be a database id
      lineItems: this.state.lineItems.concat(
        [{  id: '', 
            name: '', 
            item_desc: '', 
            qty: 1, 
            sub_account_number: '',
            main_account_number: '', 
            coa_account_number: '',
            price: 0.00,
            total_price: 0.00
        }]
      )
    })
  }

  handleRemoveLineItem = (elementIndex) => (event) => {
    this.setState({
      lineItems: this.state.lineItems.filter((item, i) => {
        return elementIndex !== i
      })
    })
  }

  handleReorderLineItems = (newLineItems) => {
    this.setState({
      lineItems: newLineItems,
    })
  }

  handleFocusSelect = (event) => {
    event.target.select()
  }


  formatCurrency = (amount) => {
    return (new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount))
  }

  calcTaxAmount = (c) => {
    return c * (this.state.taxRate / 100)
  }

  calcLineItemsTotal = () => {
    return this.state.lineItems.reduce((prev, cur) => (prev + (cur.qty * cur.price)), 0)
  }

  calcTaxTotal = () => {
    return this.calcLineItemsTotal() * (this.state.taxRate / 100)
  }

  calcGrandTotal = () => {
    return this.calcLineItemsTotal() 
  }


    componentDidMount() {
        this.getDataSupplier();
        //this.getDataBiaya();
        //console.log("test",this.state.records.value);
         
        
    };

    getDataBiaya() {
        
    }

    

    
    getDataSupplier() {
        ///supplier/Sup-data
        axios
            .get("/supplier/Sup-data")
            .then(res => {
                this.setState({ Supplier: res.data})
               //console.log("test",res.data);
            })
            .catch()
    }
   

    render() {
        const { errors } = this.state;
        return (
            <div>
                <div className="modal fade" id="add-pembelian-modal" data-reset="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Invoice Add</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onPurchaseAdd} id="add-purchase" >
                                    <Card body bg="secondary" >
                                        <Form.Label><h5 className="font-hebbo">Supplier</h5></Form.Label>
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
                                                        <Form.Label>No Invoice</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            onChange={this.onChangeNo} 
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
                                                        <Form.Label>Tgl Jatuh Tempo</Form.Label>
                                                        <Form.Control 
                                                            type="date" 
                                                            onChange={this.onChangeDueDate} 
                                                            />
                                                    </Form.Group>
                                                </Form.Row>

                                                <Form.Group as={Col} xs={6}>
                                                    {/* <Form.Label>Address</Form.Label>
                                                    <Form.Control as="textarea" /> */}
                                                    <br/>
                                                    <br/>
                                                </Form.Group>

                                                <br/>
                                                <br/>
                                                <LineItems
                                                    items={this.state.lineItems}
                                                    currencyFormatter={this.formatCurrency}
                                                    addHandler={this.handleAddLineItem}
                                                    changeHandler={this.handleLineItemChange}
                                                    changeHandlerAkun={this.handleLineItemAkun}
                                                    changeHandlerPrice={this.handleLineItemPrice}
                                                    focusHandler={this.handleFocusSelect}
                                                    deleteHandler={this.handleRemoveLineItem}
                                                    reorderHandler={this.handleReorderLineItems}

                                                />

                                                <Form.Group as={Col} xs={5}>
                                                    <Form.Label>Keterangan</Form.Label>
                                                    <Form.Control as="textarea" onChange={this.onchangeKet}/>
                                                    <br/>
                                                    <br/>
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
                                                        <small>GRAND TOTAL</small> <span className="f-w-600">
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
                                                <br/>
                                            </Card>
                                                </div>
                                            <br/>
                                            <Card.Footer><small>this form made by iosys</small></Card.Footer>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="add-purchase"
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

PembelianAddModal.propTypes = {
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
)(withRouter(PembelianAddModal));

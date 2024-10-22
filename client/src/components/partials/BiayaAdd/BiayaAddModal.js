import React, { Component, Fragment } from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addBiaya } from "../../../actions/userActions";
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

const carabayar=[
    {  name: "Transfer"},
    {  name: "Cash"}
  ]

  const TaxOpt=[
    {  b: 0, name: "no tax...",  rate: 0  },
    {  b: 1, name: "PPN",  rate: 10/100 },
    {  b: 1, name: "PPH 21",  rate: 5/100  }
  ]

class BiayaAddModal extends React.Component {
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

            coa_account_number:'',
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
            BiayaData:[],
            errors: {},

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
                expenses_account: '',
                main_account_number: '',
                sub_account_number: '',
                description: '',
                quantity: 1,
                expenses_amount: 0.00,
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

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    //SUBMITPOSTT HERE
    onBiayaAdd = e => {
        //console.log(this.state.lineItems);
        e.preventDefault();
        const newBiaya = {
            total_expense_amount: this.calcGrandTotal(),
            expense_no: this.state.expense_no,
            transaction_date: this.state.transaction_date,
            tags: `Biaya Pada Tanggal ${this.state.transaction_date}`,
            coa_account_number: this.state.coa_account_number,
            main_account_number: this.state.main_account_number, 
            sub_account_number: this.state.main_account_number,

            pay_from_account_number: this.state.pay_from_account_number,//Udh pasti dari kas kecil 
            beneficiary: this.state.beneficiary,                        // ga penting
            payment_method: this.state.payment_method,                  // ga penting
            billing_address: this.state.billing_address,                // ga penting
            expense_detail: this.state.lineItems
            // [{
            //     expenses_account: this.state.expenses_account,
            //     description: this.state.description,
            //     tax: this.state.AmountTax,
            //     expenses_amount: this.calcGrandTotal(),
            //     main_account_number: this.state.main_account_number,
            //     coa_account_number: this.state.coa_account_number
            //     }
            // ]
            
        }
        console.log(newBiaya);
        this.props.addBiaya(newBiaya, this.props.history);
        $('#add-biaya-modal').modal('hide');
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
        this.setState({
            coa_account_number: e.coa_account_number, main_account_number: e.main_account_number, sub_account_number: e.sub_account_number
        })
        
    };

    onChangeDate = e => {  
        this.setState({
            transaction_date: moment( e.target.value ).format("YYYY-MM-DD HH:mm:ss"),
        })
        //console.log("Date",this.state.transaction_date);
    };

    onChangePenerima= e => {  
        this.setState({
            beneficiary: e.FirstName,
            billing_address: e.Address
        })
        //console.log("Penerima",this.state.beneficiary);
        //console.log("Isi dari tax",this.state.expenses_amount);
        //console.log("Masok",this.state.expenses_amount);
    };

    onChangePayMethod= e => {
        this.setState({
            payment_method: e.name
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

    // onChangeTax = e => {  
    //     this.setState({
    //         TaxName: e.name,
    //         TaxRate: e.rate,
    //         TaxB: e.b,
            
    //     })
    //     this.calcTaxTotal();
    //     this.calcGrandTotal();
        
    // };

    // calcTaxTotal = () => { 
    //     if (this.state.expenses > 0){
            
    //         return   ( this.state.expenses * this.state.TaxRate  ) 
    //     }
    //     return 0
        
       
    // };

    // calcGrandTotal = () => {
    //     if (this.state.expenses > 0){
    //         //console.log("Masok")
    //         if(this.state.TaxB == 1){
                
    //             return  (this.state.expenses * 1) + (this.state.AmountTax * 1)
    //         }
    //         return this.state.expenses
    //     }
    //     return 0
    // }

    
  handleInvoiceChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleLineItemChange = (elementIndex) => (event) => {
    let lineItems = this.state.lineItems.map((item, i) => {
      if (elementIndex !== i) return item
      return {...item, [event.target.name]: event.target.value , nomor_bukti: this.state.expense_no}
    })
    this.setState({lineItems})
  }

  handleLineItemAkun = (elementIndex) => (event) => {

    let lineItems = this.state.lineItems.map((item, i) => {
      if (elementIndex !== i) return item
      return {...item, expenses_account: event.sub_account_number, main_account_number: event.main_account_number, coa_account_number: event.coa_account_number, name: event.name, tax: 0}
    })
    this.setState({lineItems})
    //console.log(this.state.lineItems);
  }

  handleAddLineItem = (event) => {
    this.setState({
      // use optimistic uuid for drag drop; in a production app this could be a database id
      lineItems: this.state.lineItems.concat(
        [{ id: uuidv4(), 
            name: '', 
            description: '', 
            quantity: 1, 
            expenses_amount: 0.00 ,
            expenses_account: '',
            main_account_number: '', 
            coa_account_number: '',
            //tax: 0,
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
    return this.state.lineItems.reduce((prev, cur) => (prev + (cur.quantity * cur.expenses_amount)), 0)
  }

  calcTaxTotal = () => {
    return this.calcLineItemsTotal() * (this.state.taxRate / 100)
  }

  calcGrandTotal = () => {
    return this.calcLineItemsTotal() 
  }


    componentDidMount() {
        this.getDataBayardari();
        //this.getDataAkunBiaya();
        this.getDataPenerima();
        this.getDataBiaya();
        //console.log("test",this.state.records.value);
         
        
    };

    getDataBiaya() {
        axios.get('/expense/Biaya-data')
        .then(response => {
            if (response.data.length < 10) {
                this.setState({
                    expense_no: `BKK/00${response.data.length + 1}/KAS/${moment().year()}`
            
                })
                //console.log("1");
              }
              else if(response.data.length < 100){
                this.setState({
                    expense_no: `BKK/0${response.data.length + 1}/KAS/${moment().year()}`
            
                })
                  //console.log("2");
              }
            //console.log("length",this.state.expense_no);
        })
    }

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
                //console.log("Bayar Dari Data", res.data[0].name);
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
                //console.log("Penerima", this.state.Penerima);
            })
            .catch()
            this.getDataPenerima = this.getDataPenerima.bind(this);
    };
   

    render() {
        const { errors } = this.state;
        return (
            <div>
                <div className="modal fade" id="add-biaya-modal" data-reset="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add Biaya</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onBiayaAdd} id="add" >
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
                                                        <Form><h3 className="form-control">{this.state.expense_no}</h3></Form>
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
                                                    focusHandler={this.handleFocusSelect}
                                                    deleteHandler={this.handleRemoveLineItem}
                                                    reorderHandler={this.handleReorderLineItems}

                                                />
                                                {/* <Table responsive="sm">
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
                                                            
                                                        </tr>
                                                    </tbody>
                        
                                                </Table> */}

                                                <Form.Group as={Col} xs={5}>
                                                    {/* <Form.Label>Memo</Form.Label>
                                                    <Form.Control as="textarea" /> */}
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

BiayaAddModal.propTypes = {
    addBiaya: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addBiaya }
)(withRouter(BiayaAddModal));

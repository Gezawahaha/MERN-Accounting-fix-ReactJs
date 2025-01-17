import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import ReactDatatable from '@ashvin27/react-datatable';
//import ReactDatatable from 'react-table';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import axios from "axios";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import BiayaAddModal from "../partials/BiayaAdd/BiayaAddModal";
import UserUpdateModal from "../partials/UserUpdateModal";
import { toast, ToastContainer} from "react-toastify";
import CurrencyFormat from 'react-currency-format';
import moment from 'moment';

import {Link, NavLink} from "react-router-dom";
import { Button } from "@material-ui/core";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

class Biaya extends Component {

    constructor(props) {
        super(props);

        this.columns = [
            // {
            //     key: "_id",
            //     text: "Id",
            //     className: "id",
            //     align: "left",
            //     sortable: true,
            // },
            {
                key: "transaction_date",
                text: "Tanggal Transaksi",
                className: "date",
                align: "left",
                width: 280,
                sortable: true,
            },
            {
                key: "expense_no",
                text: "No Biaya",
                className: "name",
                align: "left",
                width: 200,
                sortable: true,
                // cell: record => {
                //     <Fragment>
                        
                //     </Fragment>
                // }
            },
            {
                key: "pay_from_account_number",
                text: "No Akun",
                className: "name",
                align: "left",
                width: 200,
                sortable: true,
            },
            {
                key: "tags",
                text: "Keterangan",
                className: "name",
                align: "left",
                sortable: true,
            },
            {
                key: "total_expense_amount",
                text: "Total Biaya",
                className: "name",
                align: "left",
                width: 230,
                sortable: true,
                cell: record => <Fragment>{this.toCurrency(record.total_expense_amount)}</Fragment>
            },
            
            
            // {
            //     key: "total_debit",
            //     text: "Total Debit",
            //     className: "currency",
            //     align: "left",
            //     sortable: true,
            //     cell: record => <Fragment>{this.toCurrency(record.total_debit)}</Fragment>
            // },
            // {
            //     key: "total_kredit",
            //     text: "Total Kredit",
            //     className: "email",
            //     align: "left",
            //     sortable: true,
            //     cell: record => <Fragment>{this.toCurrency(record.total_kredit)}</Fragment>
            // },
            // {
            //     key: "created_at",
            //     text: "created Date",
            //     className: "date",
            //     align: "left",
            //     sortable: true
            // },
            // {
            //     key: "updated_at",
            //     text: "Update",
            //     className: "date",
            //     align: "left",
            //     sortable: true
            // }
            
            {
                key: "action",
                text: "Action",
                className: "action",
                width: 100,
                align: "left",
                sortable: false,
                cell: record => {
                    return (
                        <Fragment>
                            <button
                                data-toggle="modal"
                                data-target="#update-user-modal"
                                className="btn btn-primary btn-sm"
                                onClick={() => this.editRecord(record)}
                                style={{marginRight: '5px'}}>
                                <i className="fa fa-edit"></i>
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => this.deleteRecord(record)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </Fragment>
                    );
                }
            }
        ];

        this.config = {
            page_size: 10,
            length_menu: [ 10, 20, 50 ],
            filename: "transaction",
            no_data_text: 'No transaction found!',
            button: {
                excel: true,
                print: true,
                csv: true
            },
            language: {
                length_menu: "Show _MENU_ result per page",
                filter: "Filter in records...",
                info: "Showing _START_ to _END_ of _TOTAL_ records",
                pagination: {
                    first: "First",
                    previous: "Previous",
                    next: "Next",
                    last: "Last"
                }
            },
            show_length_menu: true,
            show_filter: true,
            show_pagination: true,
            show_info: true,
        };

        this.state = {
            records: [],
            kaskecil: '',
            biayaToday: 0,
            biayaMonth: 0,
            biayaYear: 0
        };

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

        this.getData = this.getData.bind(this);
    }

    toCurrency(numberString) {
        //console.log("number" ,numberString);
        let number = parseFloat(numberString);
        return (<CurrencyFormat value={number} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />);
    }   

    componentDidMount() {
        this.getData();
        this.getDataBank();
        
    };

    componentWillReceiveProps(nextProps) {
        this.getData()
    }

    getData() {
        axios.get('/expense/Biaya-data')
            .then(res => {
                var biayaT = 0 ;
                var biayaM = 0;
                var biayaY = 0;
                for (let index = 0; index < res.data.length; index++) {
                    if ( moment(res.data[index].transaction_date).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD") ){
                        biayaT = biayaT + (res.data[index].total_expense_amount * 1);
                       //console.log("Masok" , moment(res.data[index].transaction_date).month());
                    }
                    if( moment(res.data[index].transaction_date).month() == (moment().month()) ){
                        biayaM  = biayaM + (res.data[index].total_expense_amount * 1);

                        //temp = res.data[index].total_expense_amount * 1
                        //console.log("masuk", biayaM  )
                    }
                    if( moment(res.data[index].transaction_date).year() == (moment().year()) ){
                        biayaY  = biayaY + (res.data[index].total_expense_amount * 1);

                        //temp = res.data[index].total_expense_amount * 1
                        console.log("biayaT", biayaY  )
                    }
                }
                this.setState({ records: res.data, biayaToday: biayaT, biayaMonth: biayaM, biayaYear: biayaY})
            })
            .catch()
            //console.log(this.state.records)
    }

    getDataBank() {
        axios.get('/coa/main/sub/1')
            .then(res => {

                this.setState({ 
                    //records: res.data,
                    kaskecil: res.data[0].total_debit,
                    //kasbesar: res.data[0].total_debit
                })
                //console.log("DK",res.data.length);
            })
            .catch()      
            
    }

    

    editRecord(record) {
        this.setState({ currentRecord: record});
    }

    deleteRecord(record) {
        axios
            .delete(`expense/expense-delete/${record._id}`, {_id: record._id})
            .then(res => {
                if (res.status === 200) {
                   toast("Data Deleted", {
                       position: toast.POSITION.TOP_CENTER,
                   })
                }
            })
            .catch();
        this.getData();
    }

    pageChange(pageData) {
        //console.log("OnPageChange", pageData);
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar/>
                    <BiayaAddModal />

                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-3" id="menu-toggle"><FontAwesomeIcon icon={faList}/></button>
                            <button className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-biaya-modal"><FontAwesomeIcon icon={faPlus}/>   Transaksi</button>
                            <h1 className="mt-2 text-primary">Biaya</h1>
                            <div className="row px-2">
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-info text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">Saldo Kas Kecil</h5>
                                            <small>TOTAL</small>
                                            <h2 className="card-text"><CurrencyFormat value={ this.state.kaskecil } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-info text-white shadow-lg">
                                        <div className="card-body">
                                        <h5 className="card-title">Biaya Hari Ini</h5>
                                            <small>TOTAL</small>
                                            <h2 className="card-text"><CurrencyFormat value={ this.state.biayaToday } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-info text-white shadow-lg">
                                        <div className="card-body">
                                        <h5 className="card-title">Biaya Dalam Bulan Ini</h5>
                                            <small>TOTAL</small>
                                            <h2 className="card-text"><CurrencyFormat value={ this.state.biayaMonth } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-info text-white shadow-lg">
                                        <div className="card-body">
                                        <h5 className="card-title">Biaya Dalam Tahun Ini</h5>
                                            <small>TOTAL</small>
                                            <h2 className="card-text"><CurrencyFormat value={ this.state.biayaYear } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <br/>


                            
                            
                            <ReactDatatable
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                onPageChange={this.pageChange.bind(this)}
                            />
                        </div>
                    </div>
                    <ToastContainer/>
                </div>
            </div>
        );
    }

}

Biaya.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(Biaya);

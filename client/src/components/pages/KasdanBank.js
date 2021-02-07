

import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import {Link} from "react-router-dom";
import {faUserAlt} from "@fortawesome/free-solid-svg-icons/faUserAlt";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ReactDatatable from '@ashvin27/react-datatable';


import Grid from "@material-ui/core/Grid";
import { Card, CardBody , Table} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';


class KasdanBank extends Component {

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
                key: "sub_account_number",
                text: "Account Number",
                className: "name",
                align: "left",
                sortable: false,
                cell: record => <Fragment>{record.coa_account_number}
                
                    {record.main_account_number < 10 && (
                        `-0${record.main_account_number}`
                    )}
                    
                    {record.main_account_number >= 10 && (
                        `-${record.main_account_number}`
                    )}

                    {record.sub_account_number < 10 && (
                        `-0${record.sub_account_number}`
                    )}
                    
                    {record.sub_account_number >= 10 && (
                        `-${record.sub_account_number}`
                    )}
                  
                                        
                
                </Fragment>
            },
            {
                key: "name",
                text: "Name",
                className: "name",
                align: "left",
                sortable: true,
            },
            {
                key: "total_debit",
                text: "Total Debit",
                className: "currency",
                align: "left",
                sortable: true,
                cell: record => <Fragment>{this.toCurrency(record.total_debit)}</Fragment>
            },
            {
                key: "total_kredit",
                text: "Total Kredit",
                className: "email",
                align: "left",
                sortable: true,
                cell: record => <Fragment>{this.toCurrency(record.total_kredit)}</Fragment>
            },
            // {
            //     key: "created_at",
            //     text: "created Date",
            //     className: "date",
            //     align: "left",
            //     sortable: true
            // },
            {
                key: "updated_at",
                text: "Update",
                className: "date",
                align: "left",
                sortable: true
            },
            
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
                                data-target="#update-subakun-modal"
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
            filename: "sub_account_number",
            no_data_text: 'No sub akun found!',
            sort: { column: "coa_account_number", order: "dsc" },
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
            kaskecil: [],
            saldoBank: 0
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

        this.getDataBank = this.getDataBank.bind(this);
    }

    toCurrency(numberString) {
        //console.log("number" ,numberString);
        let number = parseFloat(numberString);
        return (<CurrencyFormat value={number} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />);
    }   

    componentDidMount() {
        this.getDataBank();
        //console.log("test",this.state.records.value);
        
    };


    getDataBank() {
        axios.get('/coa/main/sub/1')
            .then(res => {
                
                
                var saldo = 0
                for (let index = 0; index < res.data.length; index++) {
                    //console.log("for",index);
                    if (res.data[index].main_account_number == 2){
                        
                        saldo = saldo + (res.data[index].total_debit * 1);
                        //console.log("Masok", saldo);
                    }
                    
                }

                this.setState({ 
                    records: res.data,
                    kaskecil: res.data[0].total_debit,
                    saldoBank: saldo
                    //kasbesar: res.data[0].total_debit
                })
                //console.log("DK",res.data.length);
            })
            .catch()

            
            
    }

   
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
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
                            
                            <button className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-kaskecil-modal"><FontAwesomeIcon icon={faPlus}/> Top Up Kas</button>
                            <button className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-transfer-modal"><FontAwesomeIcon icon={faPlus}/> Transfer</button>
                            <button className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-terima-modal"><FontAwesomeIcon icon={faPlus}/> Terima</button>

                            <h1 className="mt-2 text-primary">Kas & Bank</h1>

                            <div className="row px-2">
                                <div className="col-sm-3 p-sm-2" >
                                    <div className="card bg-dark text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">Saldo Bank</h5>
                                            <small>TOTAL</small>
                                            <h2 className="card-text"><CurrencyFormat value={ this.state.saldoBank } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-dark text-white shadow-lg">
                                        <div className="card-body">
                                        <h5 className="card-title">Dana Yang Akan Datang</h5>
                                            <small>TOTAL</small>
                                            <h2 className="card-text"><h2 className="card-text"><CurrencyFormat value={ 0 } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2></h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-dark text-white shadow-lg">
                                        <div className="card-body">
                                        <h5 className="card-title">Dana Yang Akan Keluar</h5>
                                            <small>TOTAL</small>
                                            <h2 className="card-text"><h2 className="card-text"><CurrencyFormat value={ 0 } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2></h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-dark text-white shadow-lg">
                                        <div className="card-body">
                                        <h5 className="card-title">Saldo Kas</h5>
                                            <small>TOTAL</small>
                                            <h2 className="card-text"><h2 className="card-text"><CurrencyFormat value={ this.state.kaskecil } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2></h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            
                            <ReactDatatable
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                //onPageChange={this.pageChange.bind(this)}
                            />


                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

KasdanBank.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(KasdanBank);

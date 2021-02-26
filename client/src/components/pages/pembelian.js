import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import ReactDatatable from '@ashvin27/react-datatable';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import axios from "axios";
import {faMoneyBill, faPlus} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer} from "react-toastify";
import CurrencyFormat from 'react-currency-format';

import {Link, NavLink} from "react-router-dom";
import { Button } from "@material-ui/core";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import moment from 'moment';
import ReactMomentCountDown from "react-moment-countdown";
import PembelianAddModal from "../partials/PurchaseAdd/PembelianAddModal";
import BayarAddModal from "../partials/PurchaseAdd/BayarAddModal";
class pembelian extends Component {

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
                key: "no_purchase",
                text: "NO Invoice",
                className: "name",
                align: "center",
                width: 150,
                sortable: false,
            },
            {
                key: "keterangan",
                text: "Note",
                className: "name",
                align: "left",
                sortable: true,
                // cell: async record  => //<Fragment>{this.nameSup(record.supplierID)}</Fragment>
                
                //         {
                //             try {
                            
                //                 // name = record.supplierID;
                //                 let res = await axios.get('/supplier/Sup-data');
                                    
                //                     for (let index = 0; index < res.data.length; index++) {
                //                         if (res.data[index].SupplierID == record.supplierID) {
                //                             //console.log(res.data[index].CompanyName);
                //                             return res.data[index].CompanyName;
                                            
                                            
                //                         }
            
                //                     }
                //             } catch(err){}
                //         }
            },
            {
                key: "dueDate",
                text: "Due Date",
                width: 110,
                className: "date",
                align: "center",
                sortable: true,
                cell: record => <Fragment>  
                    {record.dueDate <= moment().format("YYYY-MM-DD HH:mm:ss") && (`Due`) }
                    {record.dueDate >= moment().format("YYYY-MM-DD HH:mm:ss") && (<ReactMomentCountDown toDate={record.dueDate} targetFormatMask='DD:HH:mm:ss'/>)}
                
                </Fragment>
            },
            {
                key: "status",
                text: "Status",
                width: 50,
                className: "name",
                align: "center",
                sortable: true,
                cell: record => <Fragment>
                    {/* {record.status == 1 && (<span class="badge badge-success">Lunas</span>) }
                    {record.dueDate <= moment().format("YYYY-MM-DD HH:mm:ss") && (<span className="badge badge-warning">On-going</span>) && (<span class="badge badge-danger">Due Date</span>) }
                    {record.status == 0 && (<span class="badge badge-success">Lunas</span>) && (<span className="badge badge-warning">On-going</span>) } */}
                    { 
                       ( record.dueDate <= moment().format("YYYY-MM-DD HH:mm:ss")
                            && <span class="badge badge-danger">Due Date</span>
                                || (record.status == 0)
                        )
                                
                        

                    }
                    
                
                </Fragment>
            },
            {
                key: "total_amount_purchase",
                text: "Total Invoice",
                align: "left",
                width: 250,
                sortable: true,
                cell: record => <Fragment>{this.toCurrency(record.total_amount_purchase)}</Fragment>
            },
            {
                key: "amount_dibayar",
                text: "Sudah di Bayar",
                align: "left",
                width: 250,
                sortable: true,
                cell: record => <Fragment>{this.toCurrency(record.amount_dibayar)}</Fragment>
            },
            // {
            //     key: "created_at",
            //     text: "created Date",
            //     className: "date",
            //     align: "left",
            //     sortable: true
            // },
            
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
            supData: [],
            invActive: 0,
            hutang: [],
        };

        this.state = {
            currentRecord: {
                SupplierID: '',
                no_purchase: '',
                purchaseDate: '',
                dueDate: '',
                Purchase_detail: [],
                total_amount_purchase: '',
                amount_dibayar: '',
                status: 0, 
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
        //console.log("testad", this.state.records);
        this.getDataHutang();
        
    };
    componentWillReceiveProps(nextProps) {
        this.getData();
        this.getDataSup();
        this.getDataHutang();
        
    }
    getDataHutang() {
        axios.get('/coa/main/test/MoA-data')
            .then(res => {
                for (let index = 0; index < res.data.length; index++) {
                    if (res.data[index].name == "Hutang Dagang") {
                        this.setState({ hutang: res.data[index].total_kredit })
                    }
                    
                }
                
                //console.log("DK", this.state.records);
            })
            .catch()
    }
    getDataSup() {
        
        axios.get('/supplier/Sup-data')
            .then(res => {
                
                this.setState({ supData: res.data})
                //console.log("DK", this.state.records);
            })
            .catch()

    }
    getData() {
        var InvBelumLunas = 0;
        axios.get('/purchase/purchase-data')
            .then(res => {
                for (let index = 0; index < res.data.length; index++) {
                    if (res.data[index].status == 0) {
                        InvBelumLunas += 1;
                        //console.log("masuk If", InvBelumLunas);
                    }
                    
                }
                this.setState({ records: res.data, invActive: InvBelumLunas})
                //console.log("DK", this.state.records);
            })
            .catch()
            
    }
    editRecord(record) {
        this.setState({ currentRecord: record});
        //console.log(this.state.currentRecord);
    }
    deleteRecord(record) {
        console.log("Masok Delete");
        axios
            .delete(`/purchase/purchase-delete/${record._id}`, {_id: record._id})
            .then(res => {
                if (res.status === 200) {
                   toast("Data Deleted!", {
                       position: toast.POSITION.TOP_CENTER,
                   })
                }
            })
            .catch();
        this.getData();
    }
    pageChange(pageData) {
        console.log("OnPageChange", pageData);
    }
    render() {
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar/>
                    <BayarAddModal />
                    <PembelianAddModal/>
                    
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-3" id="menu-toggle"><FontAwesomeIcon icon={faList}/></button>
                            <button className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-bayar-modal"><FontAwesomeIcon icon={faMoneyBill}/> Bayar Invoice</button>
                            <button className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-pembelian-modal"><FontAwesomeIcon icon={faPlus}/> Invoice</button>
                            <h1 className="mt-2 text-primary">Pembelian</h1>
                            <div className="row px-2">
                                <br/>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-secondary text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">Invoice Belum Selesai</h5>
                                            <small>TAGIHAN</small>
                                            <h2 className="card-text"><CurrencyFormat value={ this.state.invActive } displayType={'text'} thousandSeparator={true} suffix={''} /></h2>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-secondary text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">Jumlah Hutang</h5>
                                            <small>TOTAL</small>
                                            <h2 className="card-text"><CurrencyFormat value={ this.state.hutang } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-secondary text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">Pembelian Bulan Ini</h5>
                                            <small>TOTAL</small>
                                            <h2 className="card-text"><CurrencyFormat value={ 0 } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-secondary text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">Saldo Bank</h5>
                                            <small>TOTAL</small>
                                            <h2 className="card-text"><CurrencyFormat value={ 0 } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br/>


                            
                            
                            <ReactDatatable
                                id="tabledata"
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

pembelian.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(pembelian);   

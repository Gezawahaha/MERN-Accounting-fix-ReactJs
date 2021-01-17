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
import AkunAddModal from "../partials/AkunAddModal";
import UserUpdateModal from "../partials/UserUpdateModal";
import { toast, ToastContainer} from "react-toastify";
import CurrencyFormat from 'react-currency-format';

import {Link, NavLink} from "react-router-dom";
import { Button } from "@material-ui/core";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

class DaftarAkun extends Component {

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
                key: "coa_account_number",
                text: "Account Number",
                className: "name",
                align: "left",
                sortable: true,
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
            }
            
            // {
            //     key: "action",
            //     text: "Action",
            //     className: "action",
            //     width: 100,
            //     align: "left",
            //     sortable: false,
            //     cell: record => {
            //         return (
            //             <Fragment>
            //                 <button
            //                     data-toggle="modal"
            //                     data-target="#update-user-modal"
            //                     className="btn btn-primary btn-sm"
            //                     onClick={() => this.editRecord(record)}
            //                     style={{marginRight: '5px'}}>
            //                     <i className="fa fa-edit"></i>
            //                 </button>
            //                 <button
            //                     className="btn btn-danger btn-sm"
            //                     onClick={() => this.deleteRecord(record)}>
            //                     <i className="fa fa-trash"></i>
            //                 </button>
            //             </Fragment>
            //         );
            //     }
            // }
        ];

        this.config = {
            page_size: 10,
            length_menu: [ 10, 20, 50 ],
            filename: "coa_account_number",
            no_data_text: 'No akun found!',
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
            records: []
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
        console.log("number" ,numberString);
        let number = parseFloat(numberString);
        return (<CurrencyFormat value={number} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />);
    }   

    componentDidMount() {
        this.getData();
        console.log("halo");
    };

    componentWillReceiveProps(nextProps) {
        this.getData()
    }

    getData() {
        axios.get('/coa/CoA-data')
            .then(res => {
                this.setState({ records: res.data})
            })
            .catch()
    }

    editRecord(record) {
        this.setState({ currentRecord: record});
    }

    deleteRecord(record) {
        axios
            .post("/api/user-delete", {_id: record._id})
            .then(res => {
                if (res.status === 200) {
                   toast(res.data.message, {
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
                    <AkunAddModal />
                    <UserUpdateModal record={this.state.currentRecord}/>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-3" id="menu-toggle"><FontAwesomeIcon icon={faList}/></button>
                            <button className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-akun-modal"><FontAwesomeIcon icon={faPlus}/> Add Chart Akun</button>
                            <h1 className="mt-2 text-primary">Daftar Akun</h1>
                        


                            
                            
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

DaftarAkun.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(DaftarAkun);

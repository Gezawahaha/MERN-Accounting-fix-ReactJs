import React, { Component, Fragment } from "react";
import Navbar from "../../partials/Navbar";
import Sidebar from "../../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import ReactDatatable from '@ashvin27/react-datatable';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import axios from "axios";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer} from "react-toastify";
import CurrencyFormat from 'react-currency-format';

import AssetsAddModal from '../../partials/AssetsAddModal';
import moment from 'moment';

import {Link, NavLink} from "react-router-dom";
import { Button } from "@material-ui/core";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

class assets extends Component {

    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "aset_id",
                text: "#",
                width: 50,
                className: "id",
                align: "center",
                sortable: true,
            },
            {
                key: "nama_barang",
                text: "Nama Barang",
                align: "left",
                sortable: false,
            },
            {
                key: "tanggal_beli",
                text: "Tanggal Beli",
                className: "name",
                width: 170,
                align: "center",
                sortable: true,
                cell: record => moment( record ).format("YYYY-MM-DD")

            },
            {
                key: "jumlah_barang",
                text: "Jumlah Barang",
                className: "name",
                width: 150,
                align: "center",
                sortable: true,
            },
            {
                key: "price",
                text: "Harga @",
                width: 200,
                align: "center",
                sortable: true,
                cell: record => <Fragment>{this.toCurrency(record.price)}</Fragment>
            },
            {
                key: "total_price",
                text: "Total",
                width: 200,
                align: "center",
                sortable: true,
                cell: record => <Fragment>{this.toCurrency(record.total_price)}</Fragment>
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
            filename: "aset",
            no_data_text: 'No aset found!',
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
            records: []
        };

        this.state = {
            currentRecord: {
                aset_id: '',
                nama_barang: '',
                jumlah_barang: '',
                price: '',
                total_price: '',
                tanggal_beli: '',
                coa_account_number:''
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
        
        
    };

    componentWillReceiveProps(nextProps) {
        this.getData()
        
    }

    getData() {
        axios.get('/aset/Aset-Data')
            .then(res => {
                this.setState({ records: res.data})
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
            .delete(`/aset/delete/${record.aset_id}`, {_id: record.aset_id})
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
                    <AssetsAddModal />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-3" id="menu-toggle"><FontAwesomeIcon icon={faList}/></button>
                            <button className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-aset-modal"><FontAwesomeIcon icon={faPlus}/> Add Assets</button>
                            <h1 className="mt-2 text-primary">Daftar Assets</h1>
                        


                            
                            
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

assets.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(assets);

import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import ReactDatatable from '@ashvin27/react-datatable';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import axios from "axios";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import AkunAddModal from "../partials/UserAddModal";
import UserUpdateModal from "../partials/UserUpdateModal";
import { toast, ToastContainer} from "react-toastify";

import {Link} from "react-router-dom";

class DaftarAkun extends Component {

    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "_id",
                text: "Id",
                className: "id",
                align: "left",
                sortable: true,
            },
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
                text: "debit",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "total_kredit",
                text: "kredit",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "updated_at",
                text: "update Date",
                className: "date",
                align: "left",
                sortable: true
            },
            {
                key: "created_at",
                text: "created Date",
                className: "date",
                align: "left",
                sortable: true
            },
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
            filename: "Users",
            no_data_text: 'No user found!',
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
                name: '',
                email: '',
                password: '',
                password2: '',
            }
        };

        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData()
    };

    componentWillReceiveProps(nextProps) {
        this.getData()
    }

    getData() {
        axios
            .post("/akun/CoA-data")
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
                <Navbar/>
                <div className="d-flex" id="wrapper">
                    <Sidebar/>
                    <AkunAddModal />
                    <UserUpdateModal record={this.state.currentRecord}/>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-3" id="menu-toggle"><FontAwesomeIcon icon={faList}/></button>
                            <button className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-akun-modal"><FontAwesomeIcon icon={faPlus}/> Add Chart Akun</button>
                            <h1 className="mt-2 text-primary">Daftar Akun</h1>

                            <div className="row px-2">
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-primary text-white shadow-lg">
                                        <div className="card-body">
                                        <h5 className="Center">Users</h5>
                                            {/* <h5 className="card-title">Users</h5>
                                            <p className="card-text">With supporting text below as a natural lead-in to
                                                additional content.</p>
                                            <Link to="/users" className="btn btn-light"> Go to Users</Link> */}


                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-secondary text-white shadow-lg">
                                        <div className="card-body">
                                            {/* <h5 className="card-title">Special title treatment</h5>
                                            <p className="card-text">With supporting text below as a natural lead-in to
                                                additional content.</p>
                                            <a href="#" className="btn btn-light">Go somewhere</a> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-info text-white shadow-lg">
                                        <div className="card-body">
                                            {/* <h5 className="card-title">Special title treatment</h5>
                                            <p className="card-text">With supporting text below as a natural lead-in to
                                                additional content.</p>
                                            <a href="#" className="btn btn-light">Go somewhere</a> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-dark text-white shadow-lg">
                                        <div className="card-body">
                                            {/* <h5 className="card-title">Special title treatment</h5>
                                            <p className="card-text">With supporting text below as a natural lead-in to
                                                additional content.</p>
                                            <a href="#" className="btn btn-light">Go somewhere</a> */}
                                        </div>
                                    </div>
                                </div>
                            </div>

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

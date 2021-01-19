

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import FormBiaya from "../partials/FormInputBiaya";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import axios from "axios";
import ReactDatatable from '@ashvin27/react-datatable';

import { NavLink } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';



//smantic
import { Grid, Segment , Form } from 'semantic-ui-react'

const FormExampleWidthField = () => (
    <Form>
      <Form.Group>
        <Form.Input label='First name' placeholder='First Name' width={6} />
        <Form.Input label='Middle Name' placeholder='Middle Name' width={4} />
        <Form.Input label='Last Name' placeholder='Last Name' width={6} />
      </Form.Group>
      <Form.Group>
        <Form.Input placeholder='2 Wide' width={2} />
        <Form.Input placeholder='12 Wide' width={12} />
        <Form.Input placeholder='2 Wide' width={2} />
      </Form.Group>
      <Form.Group>
        <Form.Input placeholder='8 Wide' width={8} />
        <Form.Input placeholder='6 Wide' width={6} />
        <Form.Input placeholder='2 Wide' width={2} />
      </Form.Group>
    </Form>
  )

class BiayaForm extends Component {

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
                key: "date",
                text: "Tanggal",
                className: "date",
                align: "left",
                sortable: true,
            },
            {
                key: "Nomor_Akun",
                text: "Nomor",
                className: "name",
                align: "left",
                sortable: true,
            },
            {
                key: "Penerima",
                text: "Penerima",
                className: "name",
                align: "left",
                sortable: true,
            },
            {
                key: "status",
                text: "Status",
                className: "name",
                align: "left",
                sortable: true,
            },
            {
                key: "total_biaya",
                text: "Total",
                className: "number",
                align: "left",
                sortable: true
            },
            // {
            //     key: "created_at",
            //     text: "created Date",
            //     className: "date",
            //     align: "left",
            //     sortable: true
            // },
        
            
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
            length_menu: [ 10, 10, 30 ],
            filename: "coa_account_number",
            no_data_text: 'Anda belum memiliki transaksi.',
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
            kaskecil: []
        };

        this.state = {
            kasbesar: []
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

    componentDidMount() {
        //this.getData();
        //console.log("test",this.state.records.value);
    };


    getData() {
        axios.get('')
            .then(res => {
                this.setState({ 
                    records: res.data,
                    //kaskecil: res.data[1].total_debit,
                    //kasbesar: res.data[0].total_debit
                })
                console.log("DK", this.state.records);
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
                            
                            
                            <FormExampleWidthField />
                            


                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}

BiayaForm.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(BiayaForm);

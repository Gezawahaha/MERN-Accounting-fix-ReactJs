import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect ,useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../actions/authActions";
import Navbar from "../../partials/Navbar";
import Sidebar from "../../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import {Link} from "react-router-dom";
import {faUserAlt} from "@fortawesome/free-solid-svg-icons/faUserAlt";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ReactDatatable from '@ashvin27/react-datatable';
import Breadcrumb from 'react-bootstrap/Breadcrumb'

import Grid from "@material-ui/core/Grid";
import { Card, CardBody , Table} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';





class bukudetails extends Component {

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
                key: "created_at",
                text: "Tanggal",
                align: "left",
                sortable: true,
            },
            {
                key: "nomor_bukti",
                text: "NO Bukti",
                align: "left",
                sortable: true,
            },
            {
                key: "sub_account_number",
                text: "COA",
                className: "name",
                width: 100,
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
                key: "description",
                text: "Keterangan",
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
                key: "saldo",
                text: "Saldo",
                className: "date",
                align: "left",
                sortable: true
            },
            
            
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
            nama_buku:"",
            details: [],
            lenghtDetails:[],
            records: [],
            lenght: 0,
        };

        
            
        
        this.state = {
            currentRecord: {
               
            }
        };
    }
 
     

    componentDidMount() {
        this.getDataBuku(this.props.location.data);
        //console.log(this.props.location.data)
    };

    getDataBuku(buku_id) {

        if (buku_id != null){
        axios.get(`/buku/${buku_id}`)
            .then(res => {
                this.setState({ 
                    records: res.data,
                    
                })
                console.log("Books",this.state.records.details);
                this.setState({
                    nama_buku: this.state.records.nama_buku,
                    details: this.state.records.details,
                    lenghtDetails: this.state.records.details.length

                })
                //console.log("Books",this.state.records.details.length);
                
            })
            .catch()
        }
    }

   
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    //display 
    toCurrency(numberString) {
        //console.log("number" ,numberString);
        let number = parseFloat(numberString);
        return (<CurrencyFormat value={number} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />);
    } 
    

   

    render() {
        const { user } = this.props.auth;
        const { data } = this.props.location;

        
        return (
            <div>
            
            <Navbar />
                <div className="d-flex" id="wrapper">
                <Sidebar/>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                        
                            <button className="btn btn-link mt-2" id="menu-toggle"><FontAwesomeIcon icon={faList}/></button>
                            
                            <h1 className="mt-2 text-primary">Buku General Ledger </h1>
                            <Breadcrumb>
                                <Breadcrumb.Item href="/buku">Buku</Breadcrumb.Item>
                                <Breadcrumb.Item href="">Buku Detail</Breadcrumb.Item>
                            </Breadcrumb>
                            <br/>
                            <div className="row container-fluid">
                                <div className="text-align-center"><h3 >{ this.state.nama_buku }</h3></div>

{/*                                 
                                <div className="table-responsive">
                                            <Table hover className=" mb-0">
        
                                                <thead>
                                                    <tr>
                                                        <th data-priority="1">Tanggal</th>
                                                        <th data-priority="1">No.Bukti</th>
                                                        <th data-priority="1">COA</th>
                                                        <th data-priority="6">Keterangan</th>
                                                        <th data-priority="2">Debet</th>
                                                        <th data-priority="2">Kredit</th>
                                                        <th data-priority="2">Saldo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th>19/01/2021</th>
                                                        <td>BK/001/BCA/XII/2020</td>
                                                        <td>1-10-001</td>
                                                        <td>SETORAN KE KAS KECIL</td>
                                                        <td></td>
                                                        <td>  10,000,000 </td>
                                                        <td>  10,000,000 </td>
                                                    </tr>
                                                    
                                                </tbody>
                                            </Table>
                                        </div>
                                         */}
                            </div>
                            <br/>
                            <div className="row container-fluid">
                                
                            </div>
                            <ReactDatatable 
                                    config={this.config}
                                    records={this.state.details}
                                    columns={this.columns}
                                    //onPageChange={this.pageChange.bind(this)}
                                />
                            
                            <div className="row px-2">
                            {/* {data} */}
                            
                            {/* {(this.state.records || []).map(item => (
                                
                                <NavLink className="col-sm-3 p-sm-2" key={item.buku_id} to={{pathname:"/dashboard", data:item.buku_id}}>
                                    <div className="card bg-dark text-white shadow-lg">
                                        <div className="card-body">
                                        <h5 className="card-title">{item.nama_buku}</h5>
                                            <small>click to see detail</small>
                                            <h2 className="card-text"><h2 className="card-text"><CurrencyFormat value={ 0 } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2></h2>
                                        </div>
                                    </div>
                                </NavLink>
                            ))} */}

                                

                                {/* <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-dark text-white shadow-lg">
                                        <div className="card-body">
                                        <h5 className="card-title">Dana Yang Akan Datang</h5>
                                            <small>TOTAL</small>
                                            <h2 className="card-text"><h2 className="card-text"><CurrencyFormat value={ 0 } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2></h2>
                                        </div>
                                    </div>
                                </div> */}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

bukudetails.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(bukudetails);

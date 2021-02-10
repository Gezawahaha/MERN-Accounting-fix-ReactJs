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
import { data } from "jquery";





class buku extends Component {

    constructor(props) {
        super(props);

        this.state = {
            records: [],
            lenght: 0,
        };

        
            
        
        this.state = {
            currentRecord: {
               
            }
        };
    }
 
     

    componentDidMount() {
        this.getDataBuku();
        console.log("test",this.props.location);
    };

    getDataBuku() {
        axios.get('/buku/Buku-data')
            .then(res => {
                this.setState({ 
                    records: res.data,
                    lenght: res.data.length
                })
                console.log("Books",this.state.records);
                
            })
            .catch()
    }

   
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    //display 

    

   

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
                            
                            <h1 className="mt-2 text-primary">Buku General Ledger</h1>
                            <Breadcrumb>
                                <Breadcrumb.Item href="/buku">Buku</Breadcrumb.Item>
                                <Breadcrumb.Item href="" active>Buku Detail</Breadcrumb.Item>
                            </Breadcrumb>
                            <div className="row px-2">
                            
                            
                            {(this.state.records || []).map(item => (
                                
                                <NavLink className="col-sm-3 p-sm-2" key={item.buku_id} to={{pathname:"/buku/bukudetails", data:item.buku_id }}>
                                    <div className="card bg-dark text-white shadow-lg">
                                        <div className="card-body">
                                        <h5 className="card-title">{item.nama_buku}</h5>
                                            <small>click to see detail</small>
                                            <h2 className="card-text"><h2 className="card-text"><CurrencyFormat value={ 0 } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2></h2>
                                        </div>
                                    </div>
                                </NavLink>
                            ))}

                                

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

buku.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(buku);

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import {Link} from "react-router-dom";
import {faUserAlt} from "@fortawesome/free-solid-svg-icons/faUserAlt";

import { Card, CardBody } from 'reactstrap';
import { NavLink } from 'react-router-dom';

class Biaya extends Component {

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
                            <h1 className="mt-2 text-primary">Biaya</h1>

                            <Card>
                                <CardBody className="pt-5 pb-5 d-flex flex-lg-column flex-md-row flex-sm-row flex-column">
                                    <div className="price-top-part">
                                    <i  />
                                    <h5 className="mb-0 font-weight-semibold color-theme-1 mb-4">
                                        Test
                                    </h5>
                                    <p className="text-large mb-2 text-default">1000000</p>
                                    <p className="text-muted text-small">Detail ini</p>
                                    </div>
                                    <div className="pl-3 pr-3 pt-3 pb-0 d-flex price-feature-list flex-column flex-grow-1">
                                    <ul className="list-unstyled">
                                       
                                    </ul>
                                    <div className="text-center">
                                        <NavLink  className="btn btn-link btn-empty btn-lg">
                                        
                                        <i className="simple-icon-arrow-right" />
                                        </NavLink>
                                    </div>
                                    </div>
                                </CardBody>
                            </Card>
                            {/* <div className="row px-2">
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-primary text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">Users</h5>
                                            <p className="card-text">With supporting text below as a natural lead-in to
                                                additional content.</p>
                                            <Link to="/users" className="btn btn-light"><FontAwesomeIcon className="text-primary" icon={faUserAlt}/> Go to Users</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-secondary text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">Special title treatment</h5>
                                            <p className="card-text">With supporting text below as a natural lead-in to
                                                additional content.</p>
                                            <a href="#" className="btn btn-light">Go somewhere</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-info text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">Special title treatment</h5>
                                            <p className="card-text">With supporting text below as a natural lead-in to
                                                additional content.</p>
                                            <a href="#" className="btn btn-light">Go somewhere</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-dark text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">Special title treatment</h5>
                                            <p className="card-text">With supporting text below as a natural lead-in to
                                                additional content.</p>
                                            <a href="#" className="btn btn-light">Go somewhere</a>
                                        </div>
                                    </div>
                                </div>
                            </div> */}


                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Biaya.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Biaya);

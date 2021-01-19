import React, { Component , useState } from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import { Link } from 'react-router-dom';

import '../style/Navbar.css';


import { Form } from 'semantic-ui-react'


class FormInputBiaya extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() { 
        const { user } = this.props.auth;
        
        
        
        return (
            <p>BIAYA</p>
        );
    }
}

FormInputBiaya.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(FormInputBiaya);
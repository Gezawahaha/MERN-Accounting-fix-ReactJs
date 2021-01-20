import React, { Component , useState } from "react";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import { Link } from 'react-router-dom';

import '../style/Navbar.css';
import { ReactComponent as Logo } from '../style/assets/logos/white.svg';
import SettingsIcon from '@material-ui/icons/Settings';
import { IconButton } from "@material-ui/core";

import styled from 'styled-components';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import { IconContext } from 'react-icons/lib';





class Navbar extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() { 
        const { user } = this.props.auth;
        
        
        
        return (
            <div className="Bg-Nav">
                <nav className="navbar">
                    <a className="navbar-brand " href="/">PT QWERTY</a>
                </nav>
                <nav className="navbar">
                    <Logo className="Logo-Navbar" to="/"/>
                </nav>
            
                <nav className="navbar">    
                
                    
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="settings"
                                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Settings
                                    <SettingsIcon />
                                </a>
                                

                                <div className="dropdown-menu" aria-labelledby="settings" >
                                    
                                    <a className="dropdown-item" href="#" onClick={this.onLogoutClick}>Logout</a>
                                    <a className="nav-link" href="#" onClick={this.onLogoutClick}>Logout ({user.name}) <FontAwesomeIcon icon={faSignOutAlt} /> </a>
                                </div>
                            </li>
                            <li className="nav-item active">
                                
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Navbar);

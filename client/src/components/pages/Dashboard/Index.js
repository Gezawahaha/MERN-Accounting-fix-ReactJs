import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../../actions/authActions";
import Navbar from "../../partials/Navbar";
import Sidebar from "../../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import {Link} from "react-router-dom";
import {faUserAlt} from "@fortawesome/free-solid-svg-icons/faUserAlt";


import Iframe from 'react-iframe';

import '../../style/Dashboard.scss';
import { Fragment } from "react";
import DOMPurify from 'dompurify';
import { Container, Row, Col } from "reactstrap";

//Import Components
import MiniWidgets from "./MiniWidgets";
import TradingViewWidget from "./TradingViewWidget"

class Dashboard extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };
    constructor(props) {
      super(props);
      this.state = {
          breadcrumbItems : [
              { title : "Nazox", link : "#" },
              { title : "Dashboard", link : "#" },
          ],
          reports : [
              { icon : "ri-stack-line", title : "Number of Sales", value : "1452", rate : "2.4%", desc : "From previous period" },
              { icon : "ri-store-2-line", title : "Sales Revenue", value : "$ 38452", rate : "2.4%", desc : "From previous period" },
              { icon : "ri-briefcase-4-line", title : "Average Price", value : "$ 15.4", rate : "2.4%", desc : "From previous period" },
          ]
      }
  }

    render() {
        const { user } = this.props.auth;

        
        return (
            <React.Fragment>
            
            <Navbar />
                <div className="d-flex " id="wrapper">
                <Sidebar/>
                    <div id="page-content-wrapper" className="bg1">
                    <button className="btn btn-link mt-2 " id="menu-toggle"><FontAwesomeIcon icon={faList}/></button>
                    <br/>
                        <Container fluid >

                            
                        <Row>
                            <Col xl={8}>
                                <Row>
                                    <MiniWidgets reports={this.state.reports} />
                                </Row>
                                
                                {/* revenue Analytics */}
                                {/* <RevenueAnalytics/> */}
                            </Col>

                            <Col xl={4}>
                            <Iframe url="https://603ee03c0176a.htmlsave.net" className="iframe-widget" position="relative"/>
{/* 
                                sales Analytics
                                <SalesAnalytics/>

                                earning reports
                                <EarningReports/> */}

                            </Col>
                        </Row>

                        <Row></Row>
                        <Row> </Row>

                        </Container>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Dashboard);

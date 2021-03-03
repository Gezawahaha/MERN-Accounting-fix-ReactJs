import React, { Component } from 'react';
import { Col, Card, CardBody, Media } from "reactstrap";
import Iframe from 'react-iframe';

class TradingViewWidget extends Component {
    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <h4 className="card-title mb-4">Oil & Currency Market</h4>

                        <div id="donut-chart" className="apex-charts">
                            <Iframe url="https://603ee03c0176a.htmlsave.net" className="iframe-widget" position="relative"/>
                        </div>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

export default TradingViewWidget;
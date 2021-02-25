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
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import '../../style/Chartakunview.scss';

//Bootsrap
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';

class Chartakunview extends Component {

    constructor(props) {
        super(props);

        

        this.state = {
            records: [],
            dataCOA: [],
            LenghtdataCOA: 0,
            dataMAIN: [],
            LenghtdataMAIN: 0,
            dataSUB: [],
            LenghtdataSUB: 0,
            ALLDATA: []
            
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


    }
    toCurrency(numberString) {
        //console.log("number" ,numberString);
        let number = parseFloat(numberString);
        return (<CurrencyFormat value={number} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />);
    }   

    componentDidMount() {
        this.getDataCOA();
        //console.log("testad", this.state.records);
        
        
        
    };

    componentWillReceiveProps(nextProps) {
        this.getDataCOA();
        
    }
    combineData(){
        let coa = this.state.dataCOA;
        let main = this.state.dataMAIN;
        let sub = this.state.dataSUB;

        let x = [];

        x.push(coa);

       
    }

    getDataCOA() {
        axios.get('/coa/CoA-data')
            .then(res => {
                this.setState({ dataCOA: res.data , LenghtdataCOA: res.data.length})
                this.getDataMAIN( res.data )
            })
            .catch()
            //this.printdata(); 
    }
    getDataMAIN( COA ) {
        axios.get('/coa/main/test/MoA-data')
            .then(res => {
                this.setState({ dataMAIN: res.data , LenghtdataMAIN: res.data.length})
                //console.log("DK", this.state.records);
                this.getDataSUB(COA, res.data)
            })
            .catch()
            //this.printdata(); 
    }
    getDataSUB( COA,MAIN) {
        axios.get('/coa/main/sub/Sub-data')
            .then(res => {
                let x = [];
                x.push(COA,MAIN,res.data);

                this.setState({ dataSUB: res.data , LenghtdataSUB: res.data.length , ALLDATA:x})
                //console.log("DK", this.state.records);
                console.log(this.state.ALLDATA)
            })
            .catch()
            //this.printdata(); 
            
    }

    printdata() {
        for (let index_coa = 0; index_coa < this.state.LenghtdataCOA; index_coa++) {
        
        }
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
        const coadata = this.state.dataCOA
        const maindata = this.state.dataMAIN
        const subdata = this.state.dataSUB

        

        const items = []

        for (let indexC = 0; indexC < this.state.LenghtdataCOA; indexC++) {
            items.push(<br/>)
            items.push(<tr><td className="report-header report-subheader-noindent" colSpan="4"> <b>{ coadata[indexC].name }</b> </td></tr>)
            let sumM = 0
            for (let indexM = 0; indexM < this.state.LenghtdataMAIN; indexM++) {
                if (coadata[indexC].coa_account_number == maindata[indexM].coa_account_number) {
                    items.push(<tr><td className="report-subheader white-bg" colSpan="4">{maindata[indexM].name}</td></tr>)
                    let sumS = 0
                    for (let indexS = 0; indexS < this.state.LenghtdataSUB; indexS++) {
                        if (subdata[indexS].coa_account_number == maindata[indexM].coa_account_number && subdata[indexS].main_account_number == maindata[indexM].main_account_number ) {
                            sumS = subdata[indexS].total_debit + subdata[indexS].total_kredit + sumS
                            items.push(
                                <tr>
                                    <td className="report-data data-col-1">
                                        <div className="header-price-label">
                                            <a className="">{`0${subdata[indexS].coa_account_number}-${subdata[indexS].main_account_number}0-0${subdata[indexS].sub_account_number}`}</a>
                                        </div>
                                    </td>
                                    
                                    <td className="report-data width-100" width={10}>
                                        <div className="header-price-label">
                                            <a className="">{subdata[indexS].name}</a>
                                        </div>
                                    </td>
                                    <td className="header-price-label report-data text-right">
                                        <div className="header-price-label"><CurrencyFormat value={ subdata[indexS].total_debit + subdata[indexS].total_kredit } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></div>
                                    </td>
                                    <td className="tdkanan"></td>
                                </tr>
                            )
                        } 
                    }
                    items.push(
                        <tr>
                            <td className="report-subtotal" colspan="2">{`Total ${maindata[indexM].name}`}</td>
                            <td className="report-subtotal text-right" id="assets-type-1-total-data"><CurrencyFormat value={ sumS } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></td>
                            <td className="border-top-thin report-subtotal tdkanan" ></td>
                        </tr>
                    )
                    sumM = sumM + sumS
                }
                
            }
            items.push(
                <tr>
                    <td className="grand-total no-indent" colspan="2">{`Total ${coadata[indexC].name}`}</td>
                    <td className="grand-total text-right no-indent" id="assets-type-1-total-data"><CurrencyFormat value={ sumM } displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></td>
                    <td className="no-indent grand-total tdkanan"></td>
                </tr>
            )
            
            
        }

        

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar/>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-3" id="menu-toggle"><FontAwesomeIcon icon={faList}/></button>
                            
                            <h1 className="mt-2 text-primary">Neraca</h1>
                            <page className="page">
                            <Card>
                                <Card.Header>print</Card.Header>
                                <Card.Body>
                                    <div className="table-responsive container-fluid">
                                        <table className="report-table table">
                                            <thead className="report-header bg-info">
                                                <tr>
                                                    <th colspan="2"></th>
                                                    <th className="text-right">25/02/2021</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items}
                                            </tbody>
                                        </table> 
                                        <div className="report-notes new-design-font">
                                            Catatan: Akun persediaan barang dihitung berdasarkan metode Persediaan Rata-rata
                                        </div>
                                    </div>

                                </Card.Body>
                            </Card>
                            </page>

                    
                        </div>
                    </div>
                    <ToastContainer/>
                </div>
            </div>
        );
    }

}

Chartakunview.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(Chartakunview);

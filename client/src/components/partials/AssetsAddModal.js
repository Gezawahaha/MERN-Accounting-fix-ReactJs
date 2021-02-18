import React, { Component, Fragment } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addAsset } from "../../actions/userActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import axios from "axios";

import ReactSelect from "react-select";
import CurrencyFormat from 'react-currency-format';
import Currency from 'react-currency-input-field';
import NumberFormat from 'react-number-format';

import InputGroup from 'react-bootstrap/InputGroup'
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

class AssetsAddModal extends React.Component {

    constructor() {
        super();
        this.state = {
            aset_id: '',
            nama_barang: '',
            jumlah_barang: '',
            price: '',
            total_price: '',
            tanggal_beli: '',
            coa_account_number: '',
            main_account_number: '',
            sub_account_number: '',

            jenisAset: []

            
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }     

    }


    onChange = e => {
        this.setState({ [e.target.id]: e.target.value }); 
        //console.log(e.target.id,e.target.value);
        
    };

    onChangeBarang = e => {
        this.setState({
            jumlah_barang: e.target.value,
            total_price: (e.target.value * 1) * (this.state.price * 1)
        });

        //console.log(this.state.total_price);
        //console.log(this.state.price);
    };

    onChangeAset = e => {
        this.setState({
            coa_account_number: e.coa_account_number,
            main_account_number: e.main_account_number,
            sub_account_number: e.sub_account_number
        });
        console.log(e);

    }

    onChangeDate = e => {  
        this.setState({
            tanggal_beli: moment( e.target.value ).format("YYYY-MM-DD HH:mm:ss"),
        })
        //console.log("Date",this.state.transaction_date);
    };



    onAsetAdd = e => {
        e.preventDefault();
        const newAset = {
            aset_id: this.state.aset_id,
            coa_account_number: this.state.coa_account_number,
            main_account_number: this.state.main_account_number,
            sub_account_number: this.state.sub_account_number,
            nama_barang: this.state.nama_barang,
            jumlah_barang: this.state.jumlah_barang,
            price: this.state.price,
            total_price: this.state.total_price,
            tanggal_beli: this.state.tanggal_beli,
        };
        console.log(newAset) ;
        this.props.addAsset (newAset , this.props.history);
        $('#add-aset-modal').modal('hide');
            toast("Waiting For Load Data", {
                position: toast.POSITION.TOP_CENTER
            });
    };
    
    getDataJenisAset(){
        axios.get('/coa/main/sub/1/12')
            .then(res => {
                this.setState({ 
                    jenisAset: res.data,
                    
                })
                console.log("jenisAset", res.data);
            })
            .catch()
    }

    getDataIDaset() {
        axios.get('/aset/Aset-Data')
        .then(response => {
                this.setState({
                    aset_id: response.data.length + 1
            
                })
                  
              
            //console.log("length",this.state.length);
            //console.log("length",response.data);
        })
    }

    calcGrandTotal (){

    }

    componentDidMount() {
        this.getDataIDaset();
        this.getDataJenisAset();
    }

    render() {
        const { errors } = this.state;
        return (
            <div>
                <div className="modal fade" id="add-aset-modal" data-reset="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add Aset </h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onAsetAdd} id="add-Aset">
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">AssetsID</label>
                                        </div>
                                        <div className="col-md-9">
                                        <small>{ `#${this.state.aset_id}`}</small>
                                        </div>
                                    </div>

                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Jenis Asset</label>
                                        </div>
                                        <div className="col-md-9">
                                            <ReactSelect
                                                onChange={this.onChangeAset}
                                                getOptionValue={option => option}
                                                getOptionLabel={option => option.name}
                                                options={this.state.jenisAset}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Tgl Pembelian</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                type="date" 
                                                onChange={this.onChangeDate} 
                                                className="form-control"
                                                />
                                        </div>
                                    </div>                        

                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Nama Barang</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                id="nama_barang"
                                                type="text"
                                                className="form-control"
                                                />
                                        </div>
                                    </div>

                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Jumlah Barang</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChangeBarang}
                                                value={this.state.jumlah_barang}
                                                id="jumlah_barang"
                                                type="text"
                                                className="form-control"
                                                />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Harga @</label>
                                        </div>
                                        <div className="col-md-9">
                                        <InputGroup>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text>Rp. </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            
                                            <NumberFormat 
                                                className="form-control"
                                                isNumericString={ true }
                                                thousandSeparator={ true }
                                                onValueChange={(values) => {
                                                const {formattedValue, value} = values;
                
                                                this.setState({price: value,total_price: (value * 1) * (this.state.jumlah_barang * 1)})}}
                                            />
                            
                                        </InputGroup>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Total Price</label>
                                        </div>
                                        <div className="col-md-9">
                                        <InputGroup>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text>Rp. </InputGroup.Text>
                                            </InputGroup.Prepend>
                                           
                                            <NumberFormat 
                                                //id="Salary"
                                                className="form-control"
                                                value={ this.state.total_price  }
                                                isNumericString={ true }
                                                thousandSeparator={ true }
                                        
                                            />
                            
                                        </InputGroup>
                                        </div>
                                    </div>
                                    
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="add-Aset"
                                    type="submit"
                                    className="btn btn-primary">
                                    Add Assets
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

AssetsAddModal.propTypes = {
    addAsset : PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addAsset  }
)(withRouter(AssetsAddModal));

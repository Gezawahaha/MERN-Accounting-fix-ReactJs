import React from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
//import { updateSubakun } from "../../actions/userActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';

import 'react-toastify/dist/ReactToastify.css';
import CurrencyFormat from 'react-currency-format';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from "axios";

class SubAkunUpdateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.record.id,
            name: this.props.record.name,
            total_debit: this.props.record.total_debit,
            total_kredit: this.props.record.total_kredit,
            coa_account_number: this.props.record.coa_account_number,
            main_account_number: this.props.record.main_account_number,
            sub_account_number: this.props.record.sub_account_number,
            errors: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.record) {
            this.setState({
                id: nextProps.record.id,
                name: nextProps.record.name,
                total_debit: nextProps.record.total_debit,
                total_kredit: nextProps.record.total_kredit,
                coa_account_number: nextProps.record.coa_account_number,
                main_account_number: nextProps.record.main_account_number,
                sub_account_number: nextProps.record.sub_account_number,
            })
        }
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
        
    }

    onChange = e => {
        if (e.target.id === 'user-update-name') {
            this.setState({ name: e.target.value });
        }
        if (e.target.id === 'user-update-email') {
            this.setState({ email: e.target.value });
        }
        if (e.target.id === 'user-update-password') {
            this.setState({ password: e.target.value });
        }
    };

    onUserUpdate = e => {
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            total_debit: this.state.total_debit,
            total_kredit: this.state.total_kredit,
            coa_account_number: this.state.coa_account_number,
            main_account_number: this.state.main_account_number,
            sub_account_number: this.state.sub_account_number
        };
        //this.props.updateUser(newUser);
        console.log(newUser);
        axios
            .patch(`/coa/main/sub/${this.state.coa_account_number}/${this.state.main_account_number}/${this.state.sub_account_number}`, newUser)
            .then(res => {
                if (res.status === 200) {
                    $('#update-subakun-modal').modal('hide');
                    toast("Data Updated!", {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            })
            .catch();
        
    };

    render() {
        const { errors } = this.state;
        return (
            <div>
                <div className="modal fade" id="update-subakun-modal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Update Sub Account</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onUserUpdate} id="update-subakun">
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.id}
                                        id="user-update-id"
                                        type="text"
                                        className="d-none"/>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Name</label>
                                        </div>
                                        <div className="col-md-9">
                                        <InputGroup className="mb-3">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.name}
                                                id="user-update-name"
                                                type="text"
                                                error={errors.name}
                                                className={classnames("form-control", {
                                                    invalid: errors.name
                                                })}/>
                                        </InputGroup>
                                            
                                            <span className="text-danger">{errors.name}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="email">Debit</label>
                                        </div>
                                        <div className="col-md-9">
                                            {/* <input
                                                onChange={this.onChange}
                                                value={this.state.email}
                                                error={errors.email}
                                                id="user-update-email"
                                                type="email"
                                                className={classnames("form-control", {
                                                    invalid: errors.email
                                                })}
                                            /> */}

                                            <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>Rp. </InputGroup.Text>
                                                </InputGroup.Prepend>
                                                
                                                    <CurrencyFormat 
                                                        className="form-control" 
                                                        //onChange={this.onChangeJumlah}
                                                        value={ this.state.total_debit }
                                                        thousandSeparator={ true }
                                                        isNumericString={true}
                                                        onValueChange={(values) => {
                                                                const {formattedValue, value} = values;
                                                                this.setState({
                                                                    total_debit: value * 1
                                                                })
                                                                //console.log("test",this.state.coa_account_number);
                                                            }
                                                        }                                                            

                                                    />

                                                <InputGroup.Append>
                                                    <InputGroup.Text>.00</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                            <span className="text-danger">{errors.email}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="password">Kredit</label>
                                        </div>
                                        <div className="col-md-9">
                                        <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>Rp. </InputGroup.Text>
                                                </InputGroup.Prepend>
                                                
                                                    <CurrencyFormat 
                                                        className="form-control" 
                                                        //onChange={this.onChangeJumlah}
                                                        value={ this.state.total_kredit }
                                                        thousandSeparator={ true }
                                                        isNumericString={true}
                                                        onValueChange={(values) => {
                                                                const {formattedValue, value} = values;
                                                                this.setState({
                                                                    total_kredit: value * 1
                                                                })
                                                            }
                                                        }                                                            

                                                    />

                                                <InputGroup.Append>
                                                    <InputGroup.Text>.00</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                            {/* <input
                                                data-reset-input={true}
                                                autoComplete={''}
                                                onChange={this.onChange}
                                                error={errors.password}
                                                id="user-update-password"
                                                type="password"
                                                className={classnames("form-control", {
                                                    invalid: errors.password
                                                })}
                                            /> */}
                                            <span className="text-danger">{errors.password}</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="update-subakun"
                                    type="submit"
                                    className="btn btn-primary">
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

SubAkunUpdateModal.propTypes = {
    //updateUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    // { updateUser }
)(withRouter(SubAkunUpdateModal));

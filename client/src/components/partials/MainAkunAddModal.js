import React from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addAkun } from "../../actions/userActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';


class MainAkunAddModal extends React.Component {

    constructor() {
        super();
        this.state = {
            main_account_number: "",
            nameAkun: "",
            coa_account_number: "",
            name: "",
            CoAs: [],
            nameAkuns: [],
            items: [],
            errors: {},
        };

        this.getData = this.getData.bind(this);
        
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
    };

    onAkunAdd = e => {
        e.preventDefault();
        const newMainAkun = {
            main_account_number: this.state.number,
            coa_account_number: this.state.coa_account_number,
            name: this.state.name,
        };
        console.log(newMainAkun);
        this.props.addAkun(newMainAkun, this.props.history);
        $('#add-mainakun-modal').modal('hide');
            toast("Waiting For Load Data", {
                position: toast.POSITION.TOP_CENTER
            });
    };

    

    componentDidMount() {
        this.getData();
    }

    getData() {
        axios.get('/coa/CoA-data')
        .then(response => {
            if (response.data.length > 0) {
              this.setState({
                items: response.data.map(item => item.name),
                CoAs: response.data.map(CoA => CoA.coa_account_number)
              })
              
            }
            console.log(this.state.CoAs);
        })
    }

    onChangeName(e) {
        this.setState({
          name: e.target.value
        })
    }

    render() {
        const { errors } = this.state;
        const item = this.state.items;
        return (
            <div>
                <div className="modal fade" id="add-mainakun-modal" data-reset="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add Main Akun</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onAkunAdd} id="add-CoA">
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label >Account</label>
                                        </div>
                                        <div className="col-md-9">
                                            <select 
                                                ref="userInput"
                                                required
                                                className="form-control"
                                                onChange={this.onChangeName}  
                                                value={this.state.coa_account_number} 
                                            >
                                                {   
                                                    this.state.items.map(function(item) {
                                                    return <option 
                                                        key={item}
                                                        value={item}>{item}
                                                        </option>;
                                                    })
                                                }
                                            </select>
                                            
                                            {/* <input
                                                onChange={this.onChange}
                                                value={this.state.coa_account_number}
                                                error={errors.coa_account_number}
                                                id="coa_account_number"
                                                type="number"
                                                className={classnames("form-control", {
                                                    invalid: errors.coa_account_number
                                                })}
                                            /> */}
                                            <span className="text-danger">{errors.coa_account_number}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Name</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.name}
                                                id="name"
                                                type="text"
                                                error={errors.name}
                                                className={classnames("form-control", {
                                                    invalid: errors.name
                                                })}/>
                                            <span className="text-danger">{errors.name}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label >Nomor Akun</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.coa_account_number}
                                                error={errors.coa_account_number}
                                                id="coa_account_number"
                                                type="number"
                                                className={classnames("form-control", {
                                                    invalid: errors.coa_account_number
                                                })}
                                            />
                                            <span className="text-danger">{errors.coa_account_number}</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="add-CoA"
                                    type="submit"
                                    className="btn btn-primary">
                                    Add Akun
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

MainAkunAddModal.propTypes = {
    addAkun: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addAkun }
)(withRouter(MainAkunAddModal));

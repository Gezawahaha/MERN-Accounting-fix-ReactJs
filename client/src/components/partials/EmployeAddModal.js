import React from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addEmployee} from "../../actions/userActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';

import ReactSelect from "react-select";
import CurrencyFormat from 'react-currency-format';
import Currency from 'react-currency-input-field';
import NumberFormat from 'react-number-format';

import InputGroup from 'react-bootstrap/InputGroup'
import 'react-toastify/dist/ReactToastify.css';
const gender =[
    {  name: "Male"},
    {  name: "Female"}
  ]
class EmployeAddModal extends React.Component {

    constructor() {
        super();
        this.state = {
            FirstName: "",
            LastName: "",
            JobTitle: "",
            Gender: "",
            BirthDate: "",
            Salary: "",
            Phone: "",
            Address: "",
            Field: "",
            errors: {},

            SalaryFormated: "",
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

    onChangeSalary = e => {
        this.setState({
            Salary: e
        });

        //console.log(e.target.id,e.target.value);
    };

    onChangeGender = e => {
        this.setState({ 
            Gender: e.name
         });
        // console.log( "Nama data" , this.state.FirstName);
        // console.log( "Gender data" , this.state.Gender);
        // console.log( "Salary data" , this.state.Salary);
        // console.log( "Phone data" , this.state.Phone);
        
    };

    onEmployeeAdd = e => {
        e.preventDefault();
        const newEmployee = {
            FirstName: this.state.FirstName,
            LastName: this.state.LastName,
            JobTitle: this.state.JobTitle,
            Gender: this.state.Gender,
            BirthDate: this.state.BirthDate,
            Salary: this.state.Salary,
            Phone: this.state.Phone,
            Address: this.state.Address,
            Field: "empty",
        };
        console.log(newEmployee) ;
        this.props.addEmployee(newEmployee , this.props.history);
        $('#add-employee-modal').modal('hide');
            toast("Waiting For Load Data", {
                position: toast.POSITION.TOP_CENTER
            });
    };

    render() {
        const { errors } = this.state;
        return (
            <div>
                <div className="modal fade" id="add-employee-modal" data-reset="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add Karyawan</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onEmployeeAdd} id="add-Emp">
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">First Name</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.FirstName}
                                                id="FirstName"
                                                type="text"
                                                error={errors.name}
                                                className={classnames("form-control", {
                                                    invalid: errors.name
                                                })}/>
                                            <span className="text-danger">{errors.FirstName}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Last Name</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.LastName}
                                                id="LastName"
                                                type="text"
                                                error={errors.name}
                                                className={classnames("form-control", {
                                                    invalid: errors.name
                                                })}/>
                                            <span className="text-danger">{errors.LastName}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Job Title</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.JobTitle}
                                                id="JobTitle"
                                                type="text"
                                                className={classnames("form-control", {
                                                    invalid: errors.name
                                                })}/>
                                            <span className="text-danger">{errors.LastName}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Gender</label>
                                        </div>
                                        <div className="col-md-9">
                                            <ReactSelect
                                                type="string"
                                                 id="Gender"
                                                 onChange={this.onChangeGender}
                                                 getOptionValue={option => option.name}
                                                 getOptionLabel={option => option.name}
                                                 options={gender}
                                            />
                                            <span className="text-danger">{errors.Gender}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="date">BirthDate</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.BirthDate}
                                                id="BirthDate"
                                                type="date"
                                                className="form-control"
                                            />
                                            <span className="text-danger">{errors.BirthDate}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="date">Salary</label>
                                        </div>
                                        <div className="col-md-9">
                                        <InputGroup>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text>Rp. </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            {/* <Currency 
                                                id="Salary"
                                                label={ this.state.FirstName }
                                                className="form-control" 
                                                onChange={this.onChange}
                                                decimalsLimit={9}
                                            />*/}
                                            <NumberFormat 
                                                //id="Salary"
                                                className="form-control"
                                                value={ this.state.Salary }
                                                //onChange={this.onChange}
                                                isNumericString={ true }
                                                thousandSeparator={ true }
                                                onValueChange={(values) => {
                                                const {formattedValue, value} = values;
                
                                                this.setState({Salary: value})}}
                                            />
                            
                                        </InputGroup>
                                            <span className="text-danger">{errors.Salary}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="date">Phone</label>
                                        </div>
                                        <div className="col-md-9">
                                        <InputGroup>
                                            <NumberFormat
                                                //id="Phone"
                                                //onChange={this.onChange}
                                                value={ this.state.Phone}
                                                className="form-control"
                                                format="####-####-####"
                                                onValueChange={(values) => {
                                                const {formattedValue, value} = values;
                
                                                this.setState({Phone: value})}}
                                            />
                                        </InputGroup>
                                            <span className="text-danger">{errors.Salary}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="Address">Address</label>
                                        </div>
                                        <div className="col-md-9">
                                            <textarea
                                                onChange={this.onChange}
                                                value={this.state.Address}
                                                id="Address"
                                                className="form-control"
                                            />
                                            <span className="text-danger">{errors.Address}</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="add-Emp"
                                    type="submit"
                                    className="btn btn-primary">
                                    Add Karyawan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

EmployeAddModal.propTypes = {
    addEmployee: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addEmployee }
)(withRouter(EmployeAddModal));

import React from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addMainAkun } from "../../actions/userActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";

class MainAkunAddModal extends React.Component {

    constructor() {
        super();
        this.state = {
            main_account_number: "",
            coa_account_number: "",
            name: "",
            CoAs: [],
            length: 0,
            items: [],
            errors: {},
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
        console.log(e);
    };

    onAkunAdd = e => {
        e.preventDefault();
        const newMainAkun = {
            main_account_number: this.state.main_account_number,
            coa_account_number: this.state.coa_account_number,
            name: this.state.name,
        };
        console.log(newMainAkun);
        this.props.addMainAkun(newMainAkun, this.props.history);
        $('#add-mainakun-modal').modal('hide');
            toast("Waiting For Load Data", {
                position: toast.POSITION.TOP_CENTER
            });
    };

    

    componentDidMount() {
        this.getData();
        //console.log("length",this.state.items);
        //this.getDataMain();
    }

    getData() {
        axios.get('/coa/CoA-data')
        .then(response => {
            if (response.data.length > 0) {
              this.setState({
                items: response.data
              })
              
            }
            //console.log("length",this.state.length);
        })
    }

    getDataMain() {
        axios.get(`/coa/main/${this.state.coa_account_number}`)
        .then(response => {
            if (response.data.length > 0) {
              this.setState({
                length: response.data.length
              })
              
            }
            //console.log("length",this.state.length);
        })
    }

    onChangeAkun = e => {
        //Get Main Acoount Lenght
        axios.get(`/coa/main/${e.coa_account_number}`)
        .then(response => {
            if (response.data.length > 0) {
              this.setState({
                  
                length: response.data.length,
                coa_account_number: e.coa_account_number,
                main_account_number: `${response.data.length + 1}`

              })
              
            }else {
                this.setState({
                    length: 0,
                    coa_account_number: e.coa_account_number,
                    main_account_number: 1
                })
            }
            //console.log("data",this.state.main_account_number);
        })
    

        // this.setState({
        //     coa_account_number: e.coa_account_number,
        //     main_account_number: `${e.coa_account_number}-`

        // })
        //console.log("test akun",e.coa_account_number);
    }

    // onChangeAkun = e => {
    //     if(this.state.length < 10) {
    //       this.setState({
    //         coa_account_number: e.coa_account_number,
    //         main_account_number: `${e.coa_account_number}-0${this.state.length}`
      
    //     })
    //     }
    //     if(this.state.length >= 10) {
    //       this.setState({
    //         coa_account_number: e.coa_account_number,
    //         main_account_number: `${e.coa_account_number}-${this.state.length}`
      
    //     })
    //     }
        
    //     console.log("test akun",e.coa_account_number);
    //   }

    render() {
        const { errors } = this.state;
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
                                        
                                        
                                            <Select 
                                                
                                               
                                                type="number"
                                                className={classnames("", {
                                                    invalid: errors.coa_account_number
                                                })}
                                                onChange={this.onChangeAkun}
                                                getOptionValue={option => option.coa_account_number}
                                                getOptionLabel={option => option.name}
                                                options={this.state.items}

                                                
                                            />
                                                
                                            
                                           

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
                                                value={ this.state.length + 1 }
                                                error={errors.main_account_number}
                                                id="main_account_number"
                                                type="text"
                                                className={classnames("form-control", {
                                                    invalid: errors.main_account_number
                                                })}
                                            />
                                            <span className="text-danger">{errors.main_account_number}</span>
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
    addMainAkun: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addMainAkun }
)(withRouter(MainAkunAddModal));

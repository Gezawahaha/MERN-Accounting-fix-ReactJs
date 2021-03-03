import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { Component } from 'react';
import Login from "./components/auth/Login";
import NotFound from "./components/layout/NotFound";
import { Provider } from "react-redux";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Register from "./components/auth/Register";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap/dist/js/bootstrap';
import '../node_modules/font-awesome/css/font-awesome.css';
import '../node_modules/jquery/dist/jquery.min';
import '../node_modules/popper.js/dist/popper';
//import "./theme.scss";

import Dashboard from "./components/pages/Dashboard/Index";
import KasdanBank from './components/pages/KasdanBank'
import User from "./components/pages/Users";
import Employee from './components/pages/employee';
import Supplier from './components/pages/supplier'
import DaftarAkun from "./components/pages/DaftarAkun";
import DaftarMainAkun from "./components/pages/DaftarMainAkun";
import DaftarSubAkun from "./components/pages/DaftarSubAkun";
import Biaya from './components/pages/Biaya';
import Customer from './components/pages/costumer';
import costumer from "./components/pages/costumer";

import Buku from './components/pages/configure/buku';
import BukuDetails from './components/pages/configure/bukudetails';
import Assets from './components/pages/configure/assets'
import pembelian from "./components/pages/pembelian";
import penjualan from "./components/pages/penjualan";

import Chartakunview from './components/pages/configure/Chartakunview';

//import BiayaForm from './components/pages/BiayaForm';

if (localStorage.jwtToken) {
    const token = localStorage.jwtToken;
    setAuthToken(token);
    const decoded = jwt_decode(token);
    store.dispatch(setCurrentUser(decoded));
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = "./login";
    }
}

class App extends Component {
    render () {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <Switch>
                            <Route exact path="/" component={Login} />
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/login" component={Login} />
                            <Switch>
                                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                                <PrivateRoute exact path="/kasdanbank" component={KasdanBank}/>

                                <PrivateRoute exact path="/pembelian" component={pembelian}/>
                                <PrivateRoute exact path="/penjualan" component={penjualan}/>
                                <PrivateRoute exact path="/users" component={User} />
                                <PrivateRoute exact path="/karyawan" component={Employee} />
                                <PrivateRoute exact path="/supplier" component={Supplier} />
                                <PrivateRoute exact path="/customer" component={costumer} />

                                <PrivateRoute exact path="/biaya" component={Biaya} />
                                {/* <PrivateRoute exact path="/biayaForm" component={BiayaForm} /> */}
                                <PrivateRoute exact path="/daftarakun" component={DaftarAkun} />
                                <PrivateRoute exact path="/daftarakun/daftarmainakun" component={DaftarMainAkun} />
                                <PrivateRoute exact path="/daftarakun/daftarsubakun" component={DaftarSubAkun} />

                                <PrivateRoute exact path="/buku" component={Buku} />
                                <PrivateRoute exact path="/buku/bukudetails" component={BukuDetails} />
                                <PrivateRoute exact path="/assets" component={Assets} />
                                <PrivateRoute exact path="/viewcoa" component={Chartakunview}/>
                            </Switch>
                            <Route exact path="*" component={NotFound} />
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;

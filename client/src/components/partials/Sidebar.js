import React, { Component , useState } from "react";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import {Link} from "react-router-dom";

//icon
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BallotIcon from '@material-ui/icons/Ballot';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import '../style/sidebar.css';

import styled from 'styled-components';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from 'react-icons/lib';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';

const Nav = styled.div`
  background: #15171c;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;


class Sidebar extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    

    render() {
        const { user } = this.props.auth;
        

        return (

            <div className="border-right h-100" id="sidebar-wrapper">
                <div className="list-group list-group-flush">
                    <List >
                        
                        <Link to="/dashboard" className="list-group-item list-group-item-action"><HomeIcon className="icon-side"/><a >Dashboard</a></Link>
                        <Link to="/" className="list-group-item list-group-item-action"> <AssignmentIcon className="icon-side"/>Laporan</Link>
                        
                    </List>
                    <Divider />
                    <Divider />
                    <Divider />
                    <List >
                        
                        <Link to="/" className="list-group-item list-group-item-action"><AccountBalanceIcon className="icon-side"/><a >Kas & Bank</a></Link>
                        <Link to="/" className="list-group-item list-group-item-action"> <LoyaltyIcon className="icon-side"/>Penjualan</Link>
                        <Link to="/" className="list-group-item list-group-item-action"> <ShoppingCartIcon className="icon-side"/>Pembelian</Link>
                        <Link to="/" className="list-group-item list-group-item-action"> <ReceiptIcon className="icon-side"/>Biaya</Link>
                        
                        
                    </List>

                    <Divider />
                    <Divider />
                    <Divider />

                    <List >
                        <Link to="/users" className="list-group-item list-group-item-action"> <PermContactCalendarIcon className="icon-side"/>Kontak</Link>
                        <Link to="/" className="list-group-item list-group-item-action"> <BallotIcon className="icon-side"/>Daftar Akun</Link>                     
                    </List>

                    <Divider />
                    <Divider />
                    <Divider />

                    <List >
                        <button className="list-group-item list-group-item-action" onClick={this.onLogoutClick}>Logout <a>{ user.name }</a> <FontAwesomeIcon icon={faSignOutAlt} /></button>
                    </List>



                </div> 
                
            </div>
            
        );
    }
}

// const Sidebar = () => {
//     const [sidebar, setSidebar] = useState(false);
  
//     const showSidebar = () => setSidebar(!sidebar);
  
//     return (
//       <>
//         <IconContext.Provider value={{ color: '#fff' }}>
          
//           <SidebarNav sidebar={sidebar}>
//             <SidebarWrap>
//               <NavIcon to='#'>
//                 <AiIcons.AiOutlineClose onClick={showSidebar} />
//               </NavIcon>
//               {/* {SidebarData.map((item, index) => {
//                 return <SubMenu item={item} key={index} />;
//               })} */}
//             </SidebarWrap>
//           </SidebarNav>
//         </IconContext.Provider>
//       </>
//     );
// };

Sidebar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Sidebar);

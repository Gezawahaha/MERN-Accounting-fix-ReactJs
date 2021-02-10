import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BallotIcon from '@material-ui/icons/Ballot';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import SettingsIcon from '@material-ui/icons/Settings';

import Divider from '@material-ui/core/Divider';

export const SidebarData = [
    {
      
        title: 'Dashboard',
        path: '/dashboard',
        icon: <AiIcons.AiFillHome />
      
    },
    {
      
      title: 'Kas & Bank',
      path: '/kasdanbank',
      icon: <AccountBalanceIcon />
    
    },
    {
        
      title: 'Penjualan',
      path: '/penjualan',
      icon: <LoyaltyIcon />
    
    },
    {
          
      title: 'Pembelian',
      path: '/pembelian',
      icon: <ShoppingCartIcon />

    },
    {
          
      title: 'Biaya',
      path: '/biaya',
      icon: <ReceiptIcon />

    },
    {
        title: 'Daftar Akun',
        //path: '/daftarakun',
        icon: <IoIcons.IoIosPaper />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
    
        subNav: [
          {
            title: 'Account',
            path: '/daftarakun',
            icon: <IoIcons.IoIosPaper />,
            cName: 'sub-nav'
          },
          {
            title: 'Main Account',
            path: '/daftarakun/daftarmainakun',
            icon: <IoIcons.IoIosPaper />,
            cName: 'sub-nav'
          },
          {
            title: 'Sub Account',
            path: '/daftarakun/daftarsubakun',
            icon: <IoIcons.IoIosPaper />
          }
        ]
      },
      {
        title: 'Configure',
        icon: <SettingsIcon />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
    
        subNav: [
          {
            title: 'Daftar Buku',
            path: '/buku',
            icon: <IoIcons.IoIosPaper />,
            cName: 'sub-nav'
          },
          {
            title: 'Main Account',
            path: '/daftarakun/daftarmainakun',
            icon: <IoIcons.IoIosPaper />,
            cName: 'sub-nav'
          },
          {
            title: 'Sub Account',
            path: '/daftarakun/daftarsubakun',
            icon: <IoIcons.IoIosPaper />
          }
        ]
      },
      {
        title: 'Products',
        path: '/products',
        icon: <FaIcons.FaCartPlus />
      },
      {
        title: 'Kontak',
        path: '/users',
        icon: <IoIcons.IoMdPeople />
      },
      // {
      //   title: 'Messages',
      //   path: '/messages',
      //   icon: <FaIcons.FaEnvelopeOpenText />,
    
      //   iconClosed: <RiIcons.RiArrowDownSFill />,
      //   iconOpened: <RiIcons.RiArrowUpSFill />,
    
      //   subNav: [
      //     {
      //       title: 'Message 1',
      //       path: '/messages/message1',
      //       icon: <IoIcons.IoIosPaper />
      //     },
      //     {
      //       title: 'Message 2',
      //       path: '/messages/message2',
      //       icon: <IoIcons.IoIosPaper />
      //     }
      //   ]
      // },
      
      {
        title: 'Support',
        path: '/support',
        icon: <IoIcons.IoMdHelpCircle />
      }

];

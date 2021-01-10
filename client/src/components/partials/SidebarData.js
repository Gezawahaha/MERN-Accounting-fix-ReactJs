import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';


export const SidebarData = [
    {
        title: 'Overview',
        path: '/dashboard',
        icon: <AiIcons.AiFillHome />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,

        subNav: [
            {
              title: 'Users',
              path: '/daftarakun',
              icon: <IoIcons.IoIosPaper />
            },
            {
              title: 'Revenue',
              path: '/overview/revenue',
              icon: <IoIcons.IoIosPaper />
            }
        ]
    },
    {
        title: 'Daftar Akun',
        path: '/daftarakun',
        icon: <IoIcons.IoIosPaper />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
    
        subNav: [
          {
            title: 'Chart of Account',
            path: '/reports/reports1',
            icon: <IoIcons.IoIosPaper />,
            cName: 'sub-nav'
          },
          {
            title: 'Main Account',
            path: '/reports/reports2',
            icon: <IoIcons.IoIosPaper />,
            cName: 'sub-nav'
          },
          {
            title: 'Sub Account',
            path: '/reports/reports3',
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
        title: 'Team',
        path: '/team',
        icon: <IoIcons.IoMdPeople />
      },
      {
        title: 'Messages',
        path: '/messages',
        icon: <FaIcons.FaEnvelopeOpenText />,
    
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
    
        subNav: [
          {
            title: 'Message 1',
            path: '/messages/message1',
            icon: <IoIcons.IoIosPaper />
          },
          {
            title: 'Message 2',
            path: '/messages/message2',
            icon: <IoIcons.IoIosPaper />
          }
        ]
      },
      {
        title: 'Support',
        path: '/support',
        icon: <IoIcons.IoMdHelpCircle />
      }

];

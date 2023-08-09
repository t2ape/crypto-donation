import React from 'react';

import {
  AppBar,
  styled,
  Toolbar,
} from '@mui/material';
import { Link } from 'react-router-dom';

import { topBarHeight } from 'app/utils/constant';

// styled components
const AppFooter = styled(Toolbar)({
  display: 'flex',
  alignItems: 'center',
  minHeight: topBarHeight,
  '@media (max-width: 499px)': {
    width: '100%',
    display: 'table',
    minHeight: 'auto',
    padding: '1rem 0',
    '& .container': {
      flexDirection: 'column !important',
      '& a': { margin: '0 0 16px !important' },
    },
  },
});

const FooterContent = styled('div')({
  width: '100%',
  display: 'flex',
  margin: '0 auto',
  maxWidth: '1170px',
  padding: '0px 1rem',
  alignItems: 'center',
  justifyContent: 'center',
});

function Footer() {
  return (
    <AppBar color="primary" position="static" sx={{ zIndex: 96 }}>
      <AppFooter>
        <FooterContent>
          <ul
            style={{
              listStyleType: 'none',
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              padding: 0,
            }}
          >
            <li>
              <Link
                to="/about"
                style={{ color: '#fff', textDecoration: 'none' }}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/donate"
                style={{ color: '#fff', textDecoration: 'none' }}
              >
                How to Donate
              </Link>
            </li>
            <li>
              <Link
                to="/disclaimer"
                style={{ color: '#fff', textDecoration: 'none' }}
              >
                Disclaimer
              </Link>
            </li>
          </ul>
        </FooterContent>
      </AppFooter>
    </AppBar>
  );
}

export default Footer;

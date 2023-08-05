import { Box, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import { FlexAlignCenter } from 'app/components/FlexBox';

// styled components
const FlexBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const JustifyBox = styled(FlexBox)({
  maxWidth: 320,
  flexDirection: 'column',
  justifyContent: 'center',
});

const NotFoundRoot = styled(FlexAlignCenter)({
  width: '100%',
  height: '100vh !important',
});

function NotFound() {
  return (
    <NotFoundRoot>
      <JustifyBox>
        <p>404 Not Found</p>

        <Link to="/">Click here to go home</Link>
      </JustifyBox>
    </NotFoundRoot>
  );
}

export default NotFound;

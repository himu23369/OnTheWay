import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function MainAppBar() {
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#2e3b55' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px' }}>
          {/* Left-aligned Title */}
          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate('/')}
            sx={{
              cursor: 'pointer',
              fontWeight: 'bold',
              '&:hover': {
                color: '#ffc107',
              },
            }}
          >
             OnTheWay
          </Typography>

          {/* Right-aligned Buttons */}
          <Box>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{
                marginRight: 2,
                '&:hover': {
                  backgroundColor: '#1c2533',
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate('/signup')}
              sx={{
                borderColor: '#fff',
                '&:hover': {
                  borderColor: '#ffc107',
                  color: '#ffc107',
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

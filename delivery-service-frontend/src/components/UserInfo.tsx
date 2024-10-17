import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { IUser } from '../types';
import { getUserData } from '../api';

const initialUserData: IUser = {
  _id: '',
  email: '',
  name: '',
  organization: '',
  roles: [],
};

const UserInfo = () => {
  const [userData, setUserData] = useState(initialUserData);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getUserData();
      setUserData(response.data);
    };
    fetchUserData();
  }, []);

  return (
    <Card elevation={3} sx={{ borderRadius: '10px' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          src='avatar1.jpg'
          alt={userData.name}
          sx={{ width: 56, height: 56, marginRight: 2 }}
        />
        <Stack spacing={0.5}>
          <Typography variant='h6' fontWeight={700}>
            {userData.name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {userData.email}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {userData.organization}
          </Typography>
        </Stack>
      </Box>
      <Divider />
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        sx={{ px: 2, py: 1, bgcolor: 'background.default' }}
      >
        <Typography variant='body2' color='text.secondary'>
          Roles: {userData.roles.join(', ') || 'N/A'}
        </Typography>
      </Stack>
    </Card>
  );
};

export default UserInfo;

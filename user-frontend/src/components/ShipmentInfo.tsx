import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { DashboardStatus } from '../types';
import { infoMsgs } from '../constants';

type PropType = {
  dashboardStatus: DashboardStatus;
  onDismiss?: () => void; // Function to handle dismiss action
};

export default function ShipmentInfo(props: PropType) {
  const { title, msg } = infoMsgs[props.dashboardStatus];
  const severity =
    props.dashboardStatus === DashboardStatus.DELIVERED ? 'success' : 'info';

  return (
    <>
      {title && msg ? (
        <Stack
          sx={{
            width: '100%',
            animation: 'fadeIn 0.3s ease-in-out', // Smooth fade-in animation
            '@keyframes fadeIn': {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
          spacing={2}
        >
          <Alert
            severity={severity}
            icon={false}
            sx={{
              backgroundColor:
                props.dashboardStatus === DashboardStatus.DELIVERED
                  ? '#d4edda' // Light green for success (delivered)
                  : '#cce5ff', // Light blue for info (other statuses)
              borderRadius: '10px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              color: '#2e3b55',
              fontSize: '1.05rem',
              fontWeight: '500',
              padding: '12px 20px', // Extra padding for comfortable reading
              transition: 'all 0.2s ease-in-out', // Smooth transition on hover
              '&:hover': {
                transform: 'scale(1.02)', // Slight scale effect for interactivity
              },
            }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                onClick={props.onDismiss} // Call onDismiss when clicked
              >
                <CloseIcon />
              </IconButton>
            }
          >
            <AlertTitle>
              <strong>{title}</strong>
            </AlertTitle>
            {msg} {/* Displaying the message text */}
          </Alert>
        </Stack>
      ) : null}
    </>
  );
}

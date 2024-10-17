import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const style = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '20px',
  padding: '0 15px',
};

const buttonStyle = {
  width: '45%', // Equal button width
};

const cardStyle = {
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
  borderRadius: '10px', // Smooth rounded corners
  padding: '20px', // Padding inside the card
  margin: '20px 0', // Margin between other content
};

type Props = {
  onAccept: any;
  onReject: any;
};

const ShipmentRequest = (props: Props) => {
  return (
    <div>
      <Card style={cardStyle}>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            <strong>New Shipment Available</strong>
          </Typography>
          <div style={style}>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={props.onAccept}
              style={buttonStyle}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={props.onReject}
              style={buttonStyle}
            >
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentRequest;

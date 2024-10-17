import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { IShipment, ShipmentStatus } from './types';
import { updateShipmentStatus } from './api';

type Props = {
  shipmentData: IShipment;
  setShipmentData: any;
};
const statusDisplayName: Record<ShipmentStatus, string> = {
  [ShipmentStatus.deliveryAssociateAssigned]: 'Delivery Associate Assigned',
  [ShipmentStatus.pickupLocationReached]: 'Reached Pick up location',
  [ShipmentStatus.dropLocationReached]: 'Reached Drop location',
  [ShipmentStatus.transporting]: 'Transporting',
  [ShipmentStatus.delivered]: 'Delivered',
  [ShipmentStatus.requested]: 'Requested',
  [ShipmentStatus.cancelled]: 'Cancelled',
};

type UpdateAction = {
  actionName: string;
  statusToUpdate: ShipmentStatus;
};

const ShipmentDashboard = (props: Props) => {
  const { shipmentData, setShipmentData } = props;
  // Function to determine the next status action based on current status
  const updateAction = (): UpdateAction => {
    const currentStatus: ShipmentStatus = shipmentData.status;
    const pickupLocationReached = {
      actionName: statusDisplayName[ShipmentStatus.pickupLocationReached],
      statusToUpdate: ShipmentStatus.pickupLocationReached,
    };
    const transporting = {
      actionName: statusDisplayName[ShipmentStatus.transporting],
      statusToUpdate: ShipmentStatus.transporting,
    };
    const dropLocationReached = {
      actionName: statusDisplayName[ShipmentStatus.dropLocationReached],
      statusToUpdate: ShipmentStatus.dropLocationReached,
    };
    const delivered = {
      actionName: statusDisplayName[ShipmentStatus.delivered],
      statusToUpdate: ShipmentStatus.delivered,
    };
    let returnObj: UpdateAction;
    switch (currentStatus) {
      case ShipmentStatus.deliveryAssociateAssigned:
        returnObj = pickupLocationReached;
        break;
      case ShipmentStatus.pickupLocationReached:
        returnObj = transporting;
        break;
      case ShipmentStatus.transporting:
        returnObj = dropLocationReached;
        break;
      case ShipmentStatus.dropLocationReached:
        returnObj = delivered;
        break;
      default:
        returnObj = delivered;
        break;
    }
    return returnObj;
  };

  const onShipmentStatusUpdate = async (statusToUpdate: ShipmentStatus) => {
    const updatedShipmentData = await updateShipmentStatus(
      shipmentData._id,
      statusToUpdate
    );
    setShipmentData(updatedShipmentData.data);
  };
  return (
    <>
      {shipmentData._id ? (
        <div>
          <div
            style={{
              padding: '20px 40px',
            }}
          >
            <Card>
              {/* <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  Shipment details
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography variant='body1'>
                      <strong>Id</strong>: {shipmentData?._id}
                    </Typography>
                    <Typography variant='body1'>
                      <strong>
                        Status: {statusDisplayName[shipmentData.status]}
                      </strong>
                    </Typography>
                  </Stack>
                  <Divider />
                </Box>
              </CardContent> */}
              <CardContent>
  <Typography
    gutterBottom
    variant='h5'
    component='div'
    sx={{ fontWeight: 'bold', color: '#2e3b55' }}
  >
    Shipment Details
  </Typography>

  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f4f6f8',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      padding: '15px 20px',
      marginTop: '10px',
    }}
  >
    <Stack spacing={1.5}>
      <Typography variant='body1' sx={{ fontWeight: '500' }}>
        <strong>ID:</strong> {shipmentData?._id}
      </Typography>
      <Typography variant='body1' sx={{ fontWeight: '500' }}>
        <strong>Status:</strong> {statusDisplayName[shipmentData.status]}
      </Typography>
    </Stack>

    <Divider sx={{ margin: '15px 0', borderColor: '#e0e0e0' }} />
  </Box>
</CardContent>

            </Card>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '10px',
            }}
          >
            <Button
              variant='contained'
              size='large'
              onClick={async () => {
                await onShipmentStatusUpdate(updateAction().statusToUpdate);
              }}
              sx={{ backgroundColor: '#2e3b55', '&:hover': { backgroundColor: '#2e3b55' } }}
            >
              {updateAction().actionName}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default ShipmentDashboard;

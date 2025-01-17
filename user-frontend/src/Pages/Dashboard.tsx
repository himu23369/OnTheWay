import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  useReducer,
} from 'react';
import { Point } from 'geojson';
import { MapContainer, TileLayer } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import Button from '@mui/material/Button';

import UserInfo from '../components/UserInfo';
import DraggableMarker from '../components/DraggableMarker';
import ShipmentInfo from '../components/ShipmentInfo';
import {
  DashboardStatus,
  State,
  IAction,
  IShipment,
  ShipmentStatus,
} from '../types';
import {
  pickupMarkerIcon,
  dropMarkerIcon,
  driverMarkerIcon,
  API_URL,
  socketEvents,
  mapInitialViewProps,
  ACTIONS,
} from '../constants';
import './dashboard.css';
import { createShipment } from '../api';
// import GifInfo from '../components/GifInfo';

import QRCode from 'react-qr-code';

import { FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from '@mui/material';

const socket = io(API_URL);

const initialState: State = {
  pickupLocation: new LatLng(30.3525, 76.3670), // Thapar University Location
  isPickupDraggable: false,
  isShowPickupMarker: false,
  dropLocation: new LatLng(30.3398, 76.3869), // Baradari Gardens, Patiala
  isDropDraggable: false,
  isShowDropMarker: false,
  driverLocation: null,
  dashboardStatus: DashboardStatus.NO_SHIPMENT,
};

function reducer(state: State, action: IAction): State {
  switch (action.type) {
    case ACTIONS.NEW_DELIVERY_CLICKED:
      return {
        ...state,
        isPickupDraggable: true,
        isShowPickupMarker: true,
        dashboardStatus: DashboardStatus.SHIPMENT_INITIATED,
      };
    case ACTIONS.SET_DRIVER_LOCATION:
      return {
        ...state,
        driverLocation: action.payload.position, // position should be Leaflet LatLng
      };
    case ACTIONS.SET_PICKUP_LOCATION:
      return {
        ...state,
        pickupLocation: action.payload.position, // position should be Leaflet LatLng
      };
    case ACTIONS.SET_DROP_LOCATION:
      return {
        ...state,
        dropLocation: action.payload.position, // position should be Leaflet LatLng
      };
    case ACTIONS.PICKUP_SELECTED:
      return {
        ...state,
        isPickupDraggable: false,
        isDropDraggable: true,
        isShowDropMarker: true,
        dashboardStatus: DashboardStatus.PICKUP_SELECTED,
      };
    case ACTIONS.DROP_SELECTED:
      return {
        ...state,
        isDropDraggable: false,
        dashboardStatus: DashboardStatus.DROP_SELECTED,
      };
    case ACTIONS.ASSOCIATE_ASSIGNED:
      return {
        ...state,
        dashboardStatus: DashboardStatus.ASSOCIATE_ASSIGNED,
      };
    case ACTIONS.PICKUP_LOCATION_REACHED:
      return {
        ...state,
        dashboardStatus: DashboardStatus.PICKUP_LOCATION_REACHED,
      };
    case ACTIONS.TRANSPORTING:
      return {
        ...state,
        dashboardStatus: DashboardStatus.TRANSPORTING,
      };
    case ACTIONS.DROP_LOCATION_REACHED:
      return {
        ...state,
        dashboardStatus: DashboardStatus.DROP_LOCATION_REACHED,
      };
    case ACTIONS.DELIVERED:
      return {
        ...state,
        dashboardStatus: DashboardStatus.DELIVERED,
      };
    default:
      console.log('default action');
      return state;
  }
}

const shipmentStatusActionMapper: Record<ShipmentStatus, IAction> = {
  requested: { type: 'Default' },
  deliveryAssociateAssigned: { type: ACTIONS.ASSOCIATE_ASSIGNED },
  pickupLocationReached: { type: ACTIONS.PICKUP_LOCATION_REACHED },
  transporting: { type: ACTIONS.TRANSPORTING },
  dropLocationReached: { type: ACTIONS.DROP_LOCATION_REACHED },
  delivered: { type: ACTIONS.DELIVERED },
  cancelled: { type: ACTIONS.CANCELLED },
};
const Dashboard = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [price, setPrice] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    // Establish Socket
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on(socketEvents.DA_LOCATION_CHANGED, (data) => {
      try {
        const coorArr = data?.currentLocation?.coordinates;
        const isNumberType = (value: any) => typeof value === 'number';
        if (
          Array.isArray(coorArr) &&
          coorArr.length === 2 &&
          isNumberType(coorArr[0]) &&
          isNumberType(coorArr[1])
        ) {
          const lat = coorArr[1];
          const lng = coorArr[0];
          const newLocation = new LatLng(lat, lng);
          const action = {
            type: ACTIONS.SET_DRIVER_LOCATION,
            payload: { position: newLocation },
          };
          dispatch(action);
        }
      } catch (error) {
        console.error(error);
      }
    });

    // Listens to Shipment updates once subscribed
    socket.on(socketEvents.SHIPMENT_UPDATED, (data: IShipment) => {
      try {
        console.log({ data });
        // Subscribe to delivery associate
        if (data.deliveryAssociateId) {
          socket.emit(socketEvents.SUBSCRIBE_TO_DA, {
            deliveryAssociateId: data.deliveryAssociateId,
          });
        }
        // Dispatch Action on Shipment status change
        if (data.status) {
          dispatch(shipmentStatusActionMapper[data.status]);
        }
      } catch (error) {
        console.error(error);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const setPickupLocation = (position: LatLng) => {
    const action = {
      type: ACTIONS.SET_PICKUP_LOCATION,
      payload: { position },
    };
    dispatch(action);
  };
  const setDropLocation = (position: LatLng) => {
    const action = {
      type: ACTIONS.SET_DROP_LOCATION,
      payload: { position },
    };
    dispatch(action);
  };

  const onNewDeliveryClick = () => {
    const action = {
      type: ACTIONS.NEW_DELIVERY_CLICKED,
      payload: {},
    };
    dispatch(action);
    setShowMap(true);
  };

  const onPickupSelected = () => {
    const action = { type: ACTIONS.PICKUP_SELECTED, payload: {} };
    dispatch(action);
  };

  const onDropSelected = async () => {
    try {
      const action = { type: ACTIONS.DROP_SELECTED, payload: {} };
      await dispatch(action);

      const pickupPoint: Point = {
        type: 'Point',
        coordinates: [state.pickupLocation.lng, state.pickupLocation.lat],
      };
      const dropPoint: Point = {
        type: 'Point',
        coordinates: [state.dropLocation.lng, state.dropLocation.lat],
      };

      // Call API to Create new Shipment
      const createShipmentOp = await createShipment(pickupPoint, dropPoint);
      const shipment = createShipmentOp.data;

      setPrice(shipment.price);

      socket.emit(socketEvents.SUBSCRIBE_TO_SHIPMENT, {
        shipmentId: shipment._id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const ButtonNewDelivery = () => {
    return (
      <Button
        variant='contained'
        onClick={() => {
          onNewDeliveryClick();
        }}
        sx={{ backgroundColor: '#2e3b55', '&:hover': { backgroundColor: '#2e3b55' } }}
      >
        New Delivery
      </Button>
    );
  };
  const ButtonConfirmPickUp = () => {
    return (
      <Button
        variant='contained'
        onClick={() => {
          onPickupSelected();
        }}
        sx={{ backgroundColor: '#2e3b55', '&:hover': { backgroundColor: '#2e3b55' } }}
      >
        Confirm Pickup Location
      </Button>
    );
  };
  const ButtonConfirmDrop = () => {
    return (
      <Button
        variant='contained'
        onClick={() => {
          onDropSelected();
        }}
        sx={{ backgroundColor: '#2e3b55', '&:hover': { backgroundColor: '#2e3b55' } }}
      >
        Confirm Delivery Location
      </Button>
    );
  };

  return (
    <div className='container'>
      <div className='col-1'>
        <UserInfo />
        {/* Shipment info */}
        <div className='flex-center'>
          <ShipmentInfo dashboardStatus={state.dashboardStatus} />
        </div>
        {/* Action button */}
        <div className='flex-center'>
          {state.dashboardStatus === DashboardStatus.NO_SHIPMENT && (
            <ButtonNewDelivery />
          )}
          {state.dashboardStatus === DashboardStatus.SHIPMENT_INITIATED && (
            <ButtonConfirmPickUp />
          )}
          {state.dashboardStatus === DashboardStatus.PICKUP_SELECTED && (
            <ButtonConfirmDrop />
          )}
        </div>

        {/* Display Price
        {price !== null && (
          <div className="price-container flex-center">
            <h3 className="price-text">Total Price: ₹ {price.toPrecision(4)}</h3>
          </div>
        )} */}

 {/* Display Price and Payment Options */}
 {price !== null && (
        <div className="price-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 className="price-text">Total Price: ₹ {price.toPrecision(4)}</h3>

          {/* Payment Options */}
          <div className="payment-options" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" style={{ marginBottom: '10px' }}>
                Choose Payment Method:
              </FormLabel>
              <RadioGroup
                aria-label="payment-method"
                defaultValue="credit-card"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="credit-card"
                  control={<Radio />}
                  label="Credit Card"
                />
                <FormControlLabel
                  value="debit-card"
                  control={<Radio />}
                  label="Debit Card"
                />
                <FormControlLabel
                  value="paypal"
                  control={<Radio />}
                  label="PayPal"
                />
              </RadioGroup>
            </FormControl>
          </div>

          {/* QR Code for payment */}
          <div className="qr-code-container" style={{ marginTop: '20px', textAlign: 'center' }}>
            <h4>Or Pay via QR Code:</h4>
            <QRCode value={`Total Price: ₹ ${price.toPrecision(4)}`} size={150} />
          </div>
        </div>
      )}



        {/* Gif Info */}
        {/* <div className='flex-center'>
          <GifInfo dashboardStatus={state.dashboardStatus} />
        </div> */}
      </div>
      <div className='col-2'>
        {showMap && (
          <MapContainer
            style={{ width: '100%', height: '99vh' }}
            {...mapInitialViewProps}
          >
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Pickup Marker */}
            {state.isShowPickupMarker ? (
              <DraggableMarker
                isDraggable={state.isPickupDraggable}
                position={state.pickupLocation}
                setPosition={setPickupLocation}
                markerIcon={pickupMarkerIcon}
                key={'pickup-marker'}
                markerName={'pickup-marker'}
                popupMsg='Mark your pickup location'
              />
            ) : null}
            {/* Drop Location Marker */}
            {state.isShowDropMarker ? (
              <DraggableMarker
                isDraggable={state.isDropDraggable}
                position={state.dropLocation}
                setPosition={setDropLocation}
                markerIcon={dropMarkerIcon}
                key={'drop-marker'}
                markerName={'drop-marker'}
                popupMsg='Mark your delivery location'
              />
            ) : null}
            {/* Driver Location Marker */}
            {state.driverLocation && (
              <DraggableMarker
                isDraggable={false}
                position={state.driverLocation}
                markerIcon={driverMarkerIcon}
                key={'Driver-marker'}
                markerName={'Driver-marker'}
              />
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
};
export default Dashboard;


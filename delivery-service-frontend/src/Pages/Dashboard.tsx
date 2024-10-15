import React, { useEffect, useState, useReducer } from 'react';
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
import GifInfo from '../components/GifInfo';

const socket = io(API_URL);

const initialState: State = {
  pickupLocation: new LatLng(30.3525, 76.3670), // Thapar University
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
        driverLocation: action.payload.position,
      };
    case ACTIONS.SET_PICKUP_LOCATION:
      return {
        ...state,
        pickupLocation: action.payload.position,
      };
    case ACTIONS.SET_DROP_LOCATION:
      return {
        ...state,
        dropLocation: action.payload.position,
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

const Dashboard = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [price, setPrice] = useState<number | null>(null);

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
  };

  const onPickupSelected = () => {
    const action = { type: ACTIONS.PICKUP_SELECTED, payload: {} };
    dispatch(action);
  };

  const onDropSelected = async () => {
    try {
      const action = { type: ACTIONS.DROP_SELECTED, payload: {} };
      dispatch(action);

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

      // Show the price
      setPrice(shipment.price);

      // Subscribe to MongoDB Change Stream via Socket io for the created Shipment
      socket.emit(socketEvents.SUBSCRIBE_TO_SHIPMENT, {
        shipmentId: shipment._id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const ButtonNewDelivery = () => (
    <Button variant="contained" onClick={onNewDeliveryClick}>
      New Delivery
    </Button>
  );

  const ButtonConfirmPickUp = () => (
    <Button variant="contained" onClick={onPickupSelected}>
      Confirm Pickup Location
    </Button>
  );

  const ButtonConfirmDrop = () => (
    <Button variant="contained" onClick={onDropSelected}>
      Confirm Delivery Location
    </Button>
  );

  return (
    <div className="container">
      <div className="col-1">
        <UserInfo />
        {/* Shipment info */}
        <div className="flex-center">
          <ShipmentInfo dashboardStatus={state.dashboardStatus} />
        </div>
        {/* Action button */}
        <div className="flex-center">
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
        {/* Display Price */}
        {price !== null && (
          <div className="flex-center">
            <h3>Estimated Price: Rs {price.toPrecision(4)}</h3>
          </div>
        )}
        {/* Gif Info */}
        <div className="flex-center">
          <GifInfo dashboardStatus={state.dashboardStatus} />
        </div>
      </div>
      <div className="col-2">
        <MapContainer
          style={{ width: '100%', height: '99vh' }}
          {...mapInitialViewProps}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Pickup Marker */}
          {state.isShowPickupMarker && (
            <DraggableMarker
              isDraggable={state.isPickupDraggable}
              position={state.pickupLocation}
              setPosition={setPickupLocation}
              markerIcon={pickupMarkerIcon}
              key={'pickup-marker'}
              markerName={'pickup-marker'}
              popupMsg="Mark your pickup location"
            />
          )}
          {/* Drop Location Marker */}
          {state.isShowDropMarker && (
            <DraggableMarker
              isDraggable={state.isDropDraggable}
              position={state.dropLocation}
              setPosition={setDropLocation}
              markerIcon={dropMarkerIcon}
              key={'drop-marker'}
              markerName={'drop-marker'}
              popupMsg="Mark your delivery location"
            />
          )}
          {/* Driver Location Marker */}
          {state.driverLocation && (
            <DraggableMarker
              isDraggable={false}
              position={state.driverLocation}
              markerIcon={driverMarkerIcon}
              key={'driver-marker'}
              markerName={'driver-marker'}
              popupMsg="Driver's current location"
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Dashboard;

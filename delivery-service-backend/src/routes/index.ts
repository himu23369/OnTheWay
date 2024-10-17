import { Router } from 'express';
import verifyJwt from '../middleware/verifyJwt';
import * as organization from '../controller/organization';
import * as user from '../controller/user';
import * as shipment from '../controller/shipment';
import * as deliveryAssociate from '../controller/deliveryAssociate';
import * as auth from '../controller/auth';
import * as admin from '../controller/admin';
import { pong } from '../controller/ping';

let routes = Router();

/**
 * Health check route.
 * Always returns 200 OK
 */
routes.get('/ping', pong);

// login route
routes.post('/signup', user.createUser);
routes.post('/auth/login', auth.login);

//deliveryAssociate
routes.get('/delivery-associate/:id', deliveryAssociate.getDAById);
routes.post('/delivery-associate', deliveryAssociate.createDeliveryAssociate);

// Shipment
routes.patch('/shipment/:id/delivery-associate', shipment.patchDeliveryAssociate);
routes.patch('/shipment/:id/status', shipment.patchStatus);

//admindeliveryAssociate    
routes.get('/delivery-associates', deliveryAssociate.getAllDeliveryAssociates); // Get all delivery associates
routes.delete('/delivery-associates/:id', deliveryAssociate.deleteDeliveryAssociate); // Delete delivery associate by ID

//admin user
routes.get('/users', user.getAllUsersController); // Get all users
routes.delete('/users/:id', user.deleteUserController); // Delete user by ID

//admin shipment
routes.get('/shipments', shipment.getAllShipments); // Get all shipments
routes.delete('/shipments/:id', shipment.deleteShipment); // Delete shipment by ID

routes.get('/admin/stats', admin.getAdminStatsController);

// Auth middleware
routes.use(verifyJwt);

/**
 * Auth Routes
 */
// organization Routes
routes.get('/organization/:id', organization.findOrgById);
routes.post('/organization', organization.createOrg);

//user routes
routes.get('/user', user.getMe);
routes.get('/user/:userId', user.getOne);
routes.delete('/user/:userId', user.deleteOne);

//shipment
routes.post('/shipment', shipment.createShipment);

export default routes;
import express from 'express';
import { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';

const router = express.Router();

//the middleware executes in sequence so first arcjet protection will run 
// and then protectRoute will run to check if the user is authenticated
// or not before allowing access to the routes
 router.use(arcjetProtection,protectRoute);

router.get("/contacts",getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);


export default router;
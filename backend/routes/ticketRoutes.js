const express = require('express');
const {
  getCustomerTickets,
  getAllTickets,
  addNoteToTicket,
  changeTicketStatus,
  createTicket,
} = require('../controllers/ticketController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/customer/:customerId', authMiddleware, getCustomerTickets);

router.get('/', authMiddleware, adminMiddleware, getAllTickets);

router.post('/:ticketId/notes', authMiddleware, addNoteToTicket);

router.patch('/:ticketId/status', authMiddleware, changeTicketStatus);

router.post('/', authMiddleware, createTicket);

module.exports = router;

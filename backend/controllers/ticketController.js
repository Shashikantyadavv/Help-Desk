const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Note = require('../models/Note');

const getCustomerTickets = async (req, res) => {
  // console.log(req);
  try {
    const tickets = await Ticket.find({ customer: req.params.customerId }).populate('notes');
    // console.log(tickets);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets' });
  }
};

const getAllTickets = async (req, res) => {
  // console.log(req);
  try {
    const tickets = await Ticket.find().populate('customer', 'name email').populate('notes');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets' });
  }
};

const addNoteToTicket = async (req, res) => {
  const { content } = req.body;
  // console.log(content); 
  // console.log(req.body);
  // console.log(content);
  // console.log(req.user);
  try {
    const note = new Note({
      content,
      ticket: req.params.ticketId,
      authorName: req.user.name,
      role: req.user.role,
    });
    await note.save();

    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    ticket.notes.push(note._id);  
    await ticket.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error adding note' });
  }
};


const changeTicketStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.ticketId, { status, lastUpdated: Date.now() }, { new: true });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error changing status' });
  }
};

const createTicket = async (req, res) => {
  // console.log(req);
  const { title } = req.body;
  // console.log(req.user._id);
  try {
    const ticket = new Ticket({
      title,
      customer: req.user._id,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ticket' });
  }
};

module.exports = {
  getCustomerTickets,
  getAllTickets,
  addNoteToTicket,
  changeTicketStatus,
  createTicket,
};

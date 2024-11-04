import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/authContext';

const AgentPage = () => {
  const [tickets, setTickets] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [status, setStatus] = useState('');
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/tickets/');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleAddNote = async (ticketId) => {
    try {
      await axios.post(`/tickets/${ticketId}/notes`, { content: noteText });
      setNoteText('');
      fetchTickets();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleStatusChange = async (ticketId) => {
    try {
      await axios.patch(`/tickets/${ticketId}/status`, { status });
      setStatus('');
      fetchTickets();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="flex">
      <button
        onClick={logout}
        className="absolute top-4 right-4 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-200"
      >
        Logout
      </button>      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Customer Service Agent - Ticket Management</h1>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h2 className="font-bold">{ticket.title}</h2>
              <p>
                Status: <span className={`font-semibold ${ticket.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`}>{ticket.status}</span>
              </p>
              <p>Customer: {ticket.customer.name}</p>

              <div className="mt-4">
                <h4 className="font-semibold">Notes:</h4>
                <ul className="list-disc list-inside mb-4">
                  {ticket.notes.map((note, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      <span className="font-semibold">{note.authorName}({note.role}):</span> {note.content} - <em>{new Date(note.createdAt).toLocaleString()}</em>
                    </li>
                  ))}
                </ul>

                <input
                  type="text"
                  placeholder="Add a note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                <button onClick={() => handleAddNote(ticket._id)} className="bg-blue-600 text-white py-2 px-4 rounded mb-4">
                  Add Note
                </button>
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              >
                <option value="">Change Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>
              <button onClick={() => handleStatusChange(ticket._id)} className="bg-green-600 text-white py-2 px-4 rounded">
                Update Status
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentPage;

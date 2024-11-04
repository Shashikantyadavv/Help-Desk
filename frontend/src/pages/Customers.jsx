import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/authContext';

const CustomerPage = () => {
  const [tickets, setTickets] = useState([]);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [showInput, setShowInput] = useState(null);
  const { user, logout } = useContext(AuthContext); 
  const inputRef = useRef(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`/tickets/customer/${user.id}`);
      setTickets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching tickets', error);
    }
  };

  const handleNewTicket = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/tickets',
        { title: newTicketTitle }
      );
      setNewTicketTitle('');
      fetchTickets();
    } catch (error) {
      console.error('Error submitting new ticket', error);
    }
  };

  const handleAddNote = async (ticketId) => {
    try {
      await axios.post(
        `/tickets/${ticketId}/notes`,
        { content: noteText }
      );
      setNoteText('');
      setShowInput(null);
      fetchTickets();
    } catch (error) {
      console.error('Error adding note to ticket', error);
    }
  };

  const handleOutsideClick = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setShowInput(null); 
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative flex">
      <button
        onClick={logout}
        className="absolute top-4 right-4 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-200"
      >
        Logout
      </button>

      <div className="flex-1 p-8 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-blue-800 text-center">Customer Support - My Tickets</h1>

        <form onSubmit={handleNewTicket} className="bg-white p-6 shadow-lg rounded-lg mb-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 text-center">Submit New Ticket</h2>
          <input
            type="text"
            placeholder="Ticket Title"
            value={newTicketTitle}
            onChange={(e) => setNewTicketTitle(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Submit Ticket
          </button>
        </form>

        <h2 className="text-2xl font-semibold mb-4 text-blue-600 text-center">My Tickets</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-4 border-b text-center">Ticket ID</th>
                <th className="p-4 border-b text-center">Title</th>
                <th className="p-4 border-b text-center">Status</th>
                <th className="p-4 border-b text-center">Last Updated</th>
                <th className="p-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-blue-100 transition duration-200">
                  <td className="p-4 border-b text-center">{ticket._id}</td>
                  <td className="p-4 border-b text-center">{ticket.title}</td>
                  <td className="p-4 border-b text-center">
                    <span className={`font-semibold ${ticket.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4 border-b text-center">{new Date(ticket.lastUpdated).toLocaleString()}</td>
                  <td className="p-4 border-b text-center">
                    {ticket.notes && ticket.notes.map((note) => (
                      <div key={note._id} className="mb-2">
                        <p className="text-center"><strong>Note:</strong> {note.content}</p>
                        <p className="text-center"><strong>Written by:</strong> {note.authorName} ({note.role})</p>
                        <p className="text-center"><strong>Time:</strong> {new Date(note.createdAt).toLocaleString()}</p>
                        <hr className="my-2" />
                      </div>
                    ))}

                    {showInput === ticket._id ? (
                      <div ref={inputRef} className="flex items-center justify-center mt-2">
                        <input
                          type="text"
                          placeholder="Add a note"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                          onClick={() => handleAddNote(ticket._id)}
                          className="ml-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition duration-200"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowInput(ticket._id)}
                        className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition duration-200 mt-2"
                      >
                        Add Note
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;

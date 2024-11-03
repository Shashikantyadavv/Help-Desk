import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const AdminPage = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [status, setStatus] = useState('');
  const [statusCounts, setStatusCounts] = useState({ Active: 0, Pending: 0, Closed: 0 });
  const [ticketsOverTime, setTicketsOverTime] = useState({ dates: [], counts: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalUsers, setTotalUsers] = useState({ counts: [], timestamps: [] });
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchTickets();
    fetchUsers();
    fetchStatusCounts();
    fetchTicketsOverTime();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/tickets/');
      setTickets(response.data);
      // console.log(tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data);
      const counts = response.data.length;
      setTotalUsers(prevState => ({
        counts: [...prevState.counts, counts],  
        timestamps: [...prevState.timestamps, new Date().toLocaleString()] 
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStatusCounts = async () => {
    try {
      const response = await axios.get('/tickets');
      const count = response.data.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      }, { Active: 0, Pending: 0, Closed: 0 });
      setStatusCounts(count);
    } catch (error) {
      console.error('Error fetching status counts:', error);
    }
  };

  const fetchTicketsOverTime = async () => {
    try {
      const response = await axios.get('/tickets');
      const ticketDateCounts = response.data.reduce((acc, ticket) => {
        const date = new Date(ticket.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const dates = Object.keys(ticketDateCounts);
      const counts = Object.values(ticketDateCounts);
      setTicketsOverTime({ dates, counts });
    } catch (error) {
      console.error('Error fetching tickets over time:', error);
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
      fetchStatusCounts(); 
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCreateUser = async () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitNewUser = async (newUser) => {
    console.log(newUser);
    try {
      const response = await axios.post('/users/', newUser);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/users/delete/${id}`);
      fetchUsers();
    } catch (error) {
      console.log('Error deleting user: ', error);
    }
  }

  const pieData = {
    labels: ['Active', 'Pending', 'Closed', 'Total'],
    datasets: [
      {
        label: 'Ticket Status Distribution',
        data: [statusCounts.Active, statusCounts.Pending, statusCounts.Closed, statusCounts.Active + statusCounts.Pending + statusCounts.Closed],
        backgroundColor: ['#4CAF50', '#FF9800', '#F44336', '#F43698'],
        hoverOffset: 4,
      },
    ],
  };

  const lineData = {
    labels: ticketsOverTime.dates,
    datasets: [
      {
        label: 'Tickets Created Over Time',
        data: ticketsOverTime.counts,
        fill: false,
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
      },
    ],
  };
  const generateDateLabels = () => {
    const today = new Date();
    const labels = [];
    labels.push(today.toLocaleDateString());
    return labels; 
  };

  const lineData2 = {
    labels: generateDateLabels(),  
    datasets: [
      {
        label: 'Total Users',
        data: totalUsers.counts,  
        fill: false,
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
      },
    ],
  };

  return (
    <div className="flex">
      <button
        onClick={logout}
        className="absolute top-4 right-4 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-200"
      >
        Logout
      </button>
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Admin - Ticket Management</h1>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Ticket Status Distribution</h3>
            <Pie data={pieData} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Tickets Created Over Time</h3>
            <Line data={lineData} />
            <h3 className="text-xl font-semibold mb-4">Users Over Time</h3>
            <Line data={lineData2} />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">All Tickets</h2>
        {tickets.map((ticket) => (
          <div key={ticket._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="font-bold">{ticket.title}</h3>
            <p>Status: <span className={`font-semibold ${ticket.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`}>{ticket.status}</span></p>
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
                className="w-full mb-2 p-2 border rounded"
              />
              <button onClick={() => handleAddNote(ticket._id)} className="bg-blue-600 text-white py-2 px-4 rounded mb-4">
                Add Note
              </button>
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
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

        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <button onClick={handleCreateUser} className="bg-blue-600 text-white py-2 px-4 rounded mb-4">
          Create New User
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitNewUser}
        />
        {users.map((user) => (
          <div key={user._id} className="bg-white p-6 rounded-lg shadow-lg mb-4 transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
            <p className="text-gray-600">Email: <span className="font-medium">{user.email}</span></p>
            <p className="text-gray-600">Role: <span className="font-medium">{user.role}</span></p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={() => handleDelete(user._id)} 
            >
              Delete
            </button>
          </div>
        ))}

      </div>
    </div>
  );
};

export default AdminPage;

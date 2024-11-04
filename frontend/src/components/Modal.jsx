import React, {useState} from 'react';

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer'); 

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, password, role });
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Create New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-2"
              required
            >
              <option value="Customer">Customer</option>
              <option value="Agent">Customer Service Agent</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
            Create User
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;

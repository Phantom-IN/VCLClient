import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchUsers = ({ users, backendUrl }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const results = users.filter(user =>
      user.first_name.toLowerCase().includes(term) ||
      user.last_name.toLowerCase().includes(term) ||
      user.username.toLowerCase().includes(term)
    ).slice(0, 3); // Limit to top 5 matching elements

    setFilteredUsers(results);
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch(`${backendUrl}/export`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to export user data');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'users_data.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting user data:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
        <div> 
            <input
        type="text"
        placeholder="Search by name or username..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border rounded"
      />
      <ul>
        {filteredUsers.map(user => (
          <li
            key={user.id}
            className="p-2 border-b cursor-pointer"
            onClick={() => handleUserClick(user.username)}
          >
            <div className="flex items-center">
              <img
                src={`https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${user.avatar}.png`}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <div className="font-bold">{user.first_name} {user.last_name}</div>
                <div>{user.username}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      </div>
      <button
        onClick={handleExport}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Export All Users
      </button>
    </div>
  );
};

export default SearchUsers;
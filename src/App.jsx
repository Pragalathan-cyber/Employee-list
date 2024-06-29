import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import your CSS file for styling
import Spinner from './Spinner'; // Assuming you have a Spinner component

const App = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true); // Set loading to true before fetching
      try {
        const response = await axios.get('https://602e7c2c4410730017c50b9d.mockapi.io/users');
        
        // Filter out users with duplicate IDs
        const uniqueUsers = removeDuplicates(response.data, 'id');
        
        // Slice the users array to remove the first 9 users
        const filteredUsers = uniqueUsers.slice(9); // This removes the first 9 users
        
        // Initialize expanded state for each user
        const usersWithExpanded = filteredUsers.map(user => ({
          ...user,
          expanded: false
        }));

        setUsers(usersWithExpanded);
        setIsLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false); // Set loading to false in case of error
      }
    };

    fetchUsers();
  }, []);

  // Function to remove duplicates based on a key (e.g., 'id')
  const removeDuplicates = (array, key) => {
    return array.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t[key] === item[key]
      ))
    );
  };

  const handleUserClick = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, expanded: !user.expanded } : { ...user, expanded: false }
      )
    );
  };
  

  return (
<div>
  <h1 className='text-3xl ml-8 mt-1 font-bold underline'>Employees</h1>
  
  {isLoading ? (
    <Spinner />
  ) : users.length === 0 ? (
    <p className="ml-8 text-xl text-center mt-60 text-gray-600">No users found!!</p>
  ) : (
    <ul className='lg:mr-10 mt-6'>
      {users.map(user => (
        <li key={user.id} className='flex py-4 px-8 lg:pl-12 border-b-2 gap-x-5 hover:bg-slate-100' onClick={() => handleUserClick(user.id)}>
          <div>
            <img src={user.avatar} alt="Avatar" style={{ width: '80px', borderRadius: '50%' }} />
          </div>
          <div>
            <h3 className={`font-bold text-xl ${user.expanded ? 'mt-0' : 'mt-2'}`}>{user.profile.firstName} {user.profile.lastName}</h3>
            <div className={`user-details ${user.expanded ? 'active' : ''}`}>
              <p className='text-sm ml-2 text-gray-600 mt-[-4px]'>{user.jobTitle}</p>
              <p className='cursor-pointer ml-2 text-gray-600 text-sm hover:text-gray-800'>{user.profile.email}</p>
              <p className='ml-1 mt-2 text-[14.8px]'>{user.Bio}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default App;

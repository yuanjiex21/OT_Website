import React, { useState, useEffect } from 'react';

function NewList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchNonVerifiedUsers = async () => {
            try {
                const response = await fetch('https://ec2-34-233-135-215.compute-1.amazonaws.com:443/users/nonVerifiedUsers'); // Adjust the URL as needed
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    // Handle any errors that occurred during the fetch
                    console.error('Failed to fetch users:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchNonVerifiedUsers();
    }, []);

    const handleVerification = async (userId) => {
        console.log(`Button for user ${userId} was clicked`);
        try {
            const response = await fetch(`https://ec2-34-233-135-215.compute-1.amazonaws.com:443/users/promoteToVerified/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const result = await response.json();
                window.location.reload();
                alert(result.message)
            } else {
                console.error('Failed to verify user:', response.statusText)
            }
        } catch (error) {
            console.log('Error verifying user:', error)
        }
    };

    return (
        <div className='newList'>
            <h4>New account list:</h4>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Line Number</th>
                        <th>Verify new account:</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.lineNumber}</td>
                            <td>
                                <button onClick={() => handleVerification(user._id)}>
                                    Approve
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NewList;
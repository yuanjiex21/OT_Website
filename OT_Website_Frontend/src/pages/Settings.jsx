import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import AdminList from '../components/AdminList';
import NewList from '../components/NewList';
import DemoteButton from '../components/DemoteButton';

function Settings() {
    const { authData, login } = useAuth(); 
    const [linkedInURL, setlinkedInURL] = useState('');
    const [resume, setResume] = useState('')
    const [imageStatus, setImageStatus] = useState('');
    const [linkedInStatus, setLinkedInStatus] = useState('');
    const [resumeStatus, setResumeStatus] = useState('');
    const [image, setImage] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    

    const updateUserLinkedIn = async (e) => {
        e.preventDefault(); 

        const updatedData = {
            linkedIn: linkedInURL
        };

        try {
            const response = await fetch(`${apiUrl}/users/linkedIn/${authData.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('LinkedIn updated', data);
                setLinkedInStatus('LinkedIn URL updated successfully.');
                login({...authData, linkedIn: linkedInURL })
            } else {
                console.error('LinkedIn update failed:', data.message);
                setLinkedInStatus('Failed to update LinkedIn URL.');
            }
        } catch (error) {
            console.error('There was an error with the update request:', error);
            setLinkedInStatus('An error occurred during the update. Please try again later.');
        }
    };

    const updateUserImage = async (e) => {
        e.preventDefault(); 

        const formData = new FormData();
        if (image) {
            formData.append('image', image); // The name 'image' should match the key expected on the server side
        }

        try {
            const response = await fetch(`${apiUrl}/users/image/${authData.email}`, {
                method: 'PUT',
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Image updated', data);
                setImageStatus('Profile picture updated successfully.');
                login({...authData, image: URL.createObjectURL(image) })
            } else {
                console.error('Image update failed:', data.message);
                setImageStatus('Failed to update Image.');
            }
        } catch (error) {
            console.error('There was an error with the update request:', error);
            setImageStatus('An error occurred during the update. Please try again later.');
        }

    };

    const handleImageChange = (e) => {
        // Access the file from the event object
        const file = e.target.files[0];
        if (file) {
          setImage(file);
        }
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setResume(file);
        } else {
            console.error('Please select a PDF file.');
        }
    };

    const updateUserResume = async (e) => {
        e.preventDefault(); 

        const formData = new FormData();
        if (resume) {
            formData.append('resume', resume);
        }

        try {
            const response = await fetch(`${apiUrl}/users/resume/${authData.email}`, {
                method: 'PUT',
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Resume updated', data);
                setResumeStatus('Resume uploaded successfully.');
                // Optionally update authData with resume information if needed
            } else {
                console.error('Resume update failed:', data.message);
                setResumeStatus('Failed to upload resume.');
            }
        } catch (error) {
            console.error('There was an error with the update request:', error);
            setResumeStatus('An error occurred during the update. Please try again later.');
        }
    };

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await fetch(`${apiUrl}/users/checkAdminStatus/${authData._id}`, {
                    credentials: 'include' // If you're using sessions
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsAdmin(data.isAdmin);
                } else {
                    console.error('Failed to check admin status');
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
            }
        };

        checkAdminStatus();
    }, []);


    return (
        <div className='settings'>
            <div className='imageSection'>
                <h2>{authData.firstName}'s Personal Profile:</h2>
                <p>Current profile picture:</p>
                <img className="settingsImage" src={authData.image} alt="Profile Picture" />
                <p>Note: Profile images must be a perfect square for best quality. Ex: 150x150</p>
                <form onSubmit={updateUserImage}>
                    <input
                        type="file"
                        placeholder="Select your file"
                        onChange={handleImageChange}
                        required
                    />
                    <button type="submit">Update Profile Picture</button>
                    {imageStatus && <p>{imageStatus}</p>}
                </form>
            </div>
            <div className='currentLinkedIn'>
                <p>Current LinkedIn: {authData.linkedIn}</p>
                <form onSubmit={updateUserLinkedIn}>
                    <input
                        type="url"
                        placeholder="Enter your LinkedIn URL"
                        value={linkedInURL}
                        onChange={(e) => setlinkedInURL(e.target.value)}
                        required
                    />
                    <button type="submit">Update LinkedIn</button>
                    {linkedInStatus && <p>{linkedInStatus}</p>}
                </form>
            </div>

            <div className='resumeSection'>
                <p>Upload your resume (PDF Only):</p>
                <form onSubmit={updateUserResume}>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleResumeChange}
                        required
                    />
                    <button type="submit">Upload Resume</button>
                    {resumeStatus && <p>{resumeStatus}</p>}
                </form>
            </div>
            
            {isAdmin && (
                <div className='tableContainer'>
                    <DemoteButton />
                    <AdminList />
                    <NewList />
                </div>
            )}
        </div>
    );
};

export default Settings;

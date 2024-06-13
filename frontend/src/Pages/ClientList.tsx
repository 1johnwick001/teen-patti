import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import API_BASE_URL from '../config/Config';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

interface People {
    _id: number;
    name: string;
    email: string;
    mobile: string;
}

function ClientList() {
    const [clients, setClients] = useState<People[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const token = localStorage.getItem('token');

    const fetchClientList = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/userlist`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data);
            
            setClients(data?.data.reverse());
        } catch (error) {
            console.error('Error fetching clients list:', error);
        }
    }, []);

    useEffect(() => {
        fetchClientList();
    }, [fetchClientList]);

    // Get current clients
    const indexOfLastClient = currentPage * clientPerPage;
    const indexOfFirstClient = indexOfLastClient - clientPerPage;
    const currentClient = clients.slice(indexOfFirstClient, indexOfLastClient);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleDeleteConfirmed = async () => {
        if (deleteId !== null) {
            try {
                await axios.delete(`${API_BASE_URL}/api/user/deleteUser/${deleteId}`);
                setDeleteId(null);
                setOpen(false);
                fetchClientList();
            } catch (error) {
                console.error("Error deleting client:", error);
            }
        }
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDeleteId(null);
    };

    return (
        <>
            <Header />
            <div className='d-flex justify-content-center p-1' style={{ color: 'black', backgroundColor: '#4fc9d1' }}>
                <h1>Client's List</h1>
            </div>
            <div className="container">
                <br />
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th> name</th>
                            <th> Email</th>
                            <th> Mobile</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentClient.map((user, index) => (
                            <tr key={user._id}>
                                <td>{(currentPage - 1) * clientPerPage + index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.mobile}</td>
                                <td>
                                    <Link to={`/editclientList/${user._id}`} className="btn btn-custom btn-md me-1 m-2" style={{ color: 'black', backgroundColor: '#4fc9d1' }}>
                                        Edit
                                    </Link>
                                    <button className="btn btn-danger btn-md" onClick={() => handleDelete(user._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ul className="pagination justify-content-end">
                    {Array.from({ length: Math.ceil(clients.length / clientPerPage) }).map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <br />
                            <button onClick={() => paginate(index + 1)} className="page-link" style={{ backgroundColor: '#4fc9d1', }}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this client?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} style={{ backgroundColor: '#4fc9d1', color: 'black' }} startIcon={<CloseIcon />}>
                        No
                    </Button>
                    <Button onClick={handleDeleteConfirmed} style={{ backgroundColor: '#4fc9d1', color: 'black' }} startIcon={<DoneIcon />}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ClientList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaMotorcycle, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCircle } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import DeliveryPersonFormModal from '../components/DeliveryPersonFormModal';

const ManageDeliveryPersonnel = () => {
    const [deliveryPersons, setDeliveryPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { showAlert, showConfirm } = useModal();

    // NEW States for modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentDeliveryPerson, setCurrentDeliveryPerson] = useState(null); // Data for editing

    const fetchDeliveryPersons = async () => {
        setLoading(true);
        setError('');
        try {
            const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
            const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
            if (!token) {
                showAlert('Authentication required. Please log in.');
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:3000/api/delivery', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDeliveryPersons(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to fetch delivery personnel.';
            setError(errorMessage);
            showAlert(`Error: ${errorMessage}`);
            console.error('Frontend (ManageDeliveryPersonnel) - Fetch error:', err.response ? err.response.data : err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveryPersons();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'on_delivery': return 'bg-blue-100 text-blue-800';
            case 'offline': return 'bg-gray-100 text-gray-800';
            case 'unavailable': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'available': return <FaCheckCircle className="inline mr-1" />;
            case 'on_delivery': return <FaMotorcycle className="inline mr-1" />;
            case 'offline': return <FaCircle className="inline mr-1 text-gray-500" />;
            case 'unavailable': return <FaTimesCircle className="inline mr-1" />;
            default: return <FaHourglassHalf className="inline mr-1" />;
        }
    };

    // NEW: Handle submission from the DeliveryPersonFormModal (for add)
    const handleAddSubmit = async (formData) => {
        try {
            const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
            const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
            if (!token) {
                showAlert('Authentication required.');
                return;
            }

            await axios.post('http://localhost:3000/api/delivery', {
                userId: formData.userId,
                name: formData.name,
                phone: formData.phone,
                vehicleType: formData.vehicleType,
                licensePlate: formData.licensePlate
            }, { headers: { Authorization: `Bearer ${token}` } });

            showAlert('Delivery person added successfully! Remember to update their role in the database if they are not already a "delivery_personnel".');
            setIsAddModalOpen(false); // Close modal on success
            fetchDeliveryPersons(); // Refresh list
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to add delivery person.';
            showAlert(`Error: ${msg}`);
            console.error('Frontend (ManageDeliveryPersonnel) - Create error:', err.response ? err.response.data : err);
        }
    };

    // FIX: Handle submission from the DeliveryPersonFormModal (for edit)
    const handleEditSubmit = async (formData) => {
        try {
            const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
            const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
            if (!token) {
                showAlert('Authentication required.');
                return;
            }

            // Create a new object to send to the backend without the userId field
            const updateData = {
                name: formData.name,
                phone: formData.phone,
                vehicleType: formData.vehicleType,
                licensePlate: formData.licensePlate,
                status: formData.status,
            };

            // The ID of the delivery person being edited is in currentDeliveryPerson._id
            await axios.put(`http://localhost:3000/api/delivery/${currentDeliveryPerson._id}`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            showAlert('Delivery person updated successfully!');
            setIsEditModalOpen(false); // Close modal on success
            fetchDeliveryPersons(); // Refresh list
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to update delivery person.';
            showAlert(`Error: ${msg}`);
            console.error('Frontend (ManageDeliveryPersonnel) - Update error:', err.response ? err.response.data : err);
        }
    };


    const handleDeleteDeliveryPerson = (dpId, dpName) => {
        showConfirm(
            `Are you sure you want to delete ${dpName}'s profile? This cannot be undone.`,
            async () => {
                try {
                    const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
                    const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
                    if (!token) {
                        showAlert('Authentication required.');
                        return;
                    }

                    await axios.delete(`http://localhost:3000/api/delivery/${dpId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    showAlert(`${dpName}'s profile deleted successfully.`);
                    fetchDeliveryPersons(); // Refresh list
                } catch (err) {
                    const msg = err.response?.data?.error || 'Failed to delete delivery person.';
                    showAlert(`Error: ${msg}`);
                    console.error('Frontend (ManageDeliveryPersonnel) - Delete error:', err.response ? err.response.data : err);
                }
            },
            () => showAlert('Deletion cancelled.')
        );
    };


    if (loading) return <div className="p-6 text-center"><p className="text-gray-600 text-lg">Loading delivery personnel...</p></div>;
    if (error) return <div className="p-6 text-center"><p className="text-red-600 font-semibold">{error}</p></div>;

    return (
        <section className="bg-white rounded-xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-200 pb-4">
                <h2 className="text-3xl font-bold text-gray-800">Manage Delivery Personnel</h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center transition duration-200 ease-in-out shadow-md hover:shadow-lg font-semibold"
                >
                    <FaPlus className="mr-2" /> Add Delivery Person
                </button>
            </div>

            {deliveryPersons.length === 0 ? (
                <p className="text-gray-600 text-center text-lg mt-8">No delivery personnel found. Add one to get started!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deliveryPersons.map((dp) => (
                        <div key={dp._id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-100 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                                    <FaMotorcycle className="mr-2 text-yellow-600" /> {dp.name}
                                </h3>
                                <p className="text-gray-700 mb-1"><strong>User ID:</strong> {dp.userId}</p>
                                <p className="text-gray-700 mb-1"><strong>Phone:</strong> {dp.phone}</p>
                                <p className="text-gray-700 mb-1"><strong>Vehicle:</strong> {dp.vehicleType} ({dp.licensePlate})</p>
                                <p className="text-gray-700 mb-2">
                                    <strong>Status:</strong>
                                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(dp.status)}`}>
                                        {getStatusIcon(dp.status)} {dp.status.replace(/_/g, ' ')}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-500">Registered: {new Date(dp.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-4 flex space-x-2">
                                <button
                                    onClick={() => { setCurrentDeliveryPerson(dp); setIsEditModalOpen(true); }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm transition shadow-sm"
                                >
                                    <FaEdit className="mr-1" /> Edit Details
                                </button>
                                <button
                                    onClick={() => handleDeleteDeliveryPerson(dp._id, dp.name)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center text-sm transition shadow-sm"
                                >
                                    <FaTrash className="mr-1" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Render the Add Delivery Person Modal */}
            <DeliveryPersonFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddSubmit}
                initialData={null} // No initial data for add mode
            />

            {/* Render the Edit Delivery Person Modal */}
            {currentDeliveryPerson && ( // Only render if there's data to edit
                <DeliveryPersonFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEditSubmit}
                    initialData={currentDeliveryPerson} // Pass current data for edit mode
                />
            )}
        </section>
    );
};

export default ManageDeliveryPersonnel;
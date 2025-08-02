import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const DeliveryPersonFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        userId: '',
        name: '',
        phone: '',
        vehicleType: 'Motorcycle', // Default
        licensePlate: '',
        status: 'offline', // Default
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                userId: initialData.userId || '',
                name: initialData.name || '',
                phone: initialData.phone || '',
                vehicleType: initialData.vehicleType || 'Motorcycle',
                licensePlate: initialData.licensePlate || '',
                status: initialData.status || 'offline',
            });
        } else {
            // Reset form for new creation
            setFormData({
                userId: '',
                name: '',
                phone: '',
                vehicleType: 'Motorcycle',
                licensePlate: '',
                status: 'offline',
            });
        }
        setErrors({}); // Clear errors on modal open/data change
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
        else if (!formData.phone.match(/^(07|(\+94)?)(\d{8})$/)) newErrors.phone = 'Invalid phone number format.';
        if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required.';
        if (!formData.licensePlate.trim()) newErrors.licensePlate = 'License plate is required.';

        if (!initialData && !formData.userId.trim()) { // userId only required for creation
            newErrors.userId = 'User ID is required for new delivery person.';
            if (formData.userId.trim() && !formData.userId.match(/^[0-9a-fA-F]{24}$/)) {
                newErrors.userId = 'User ID must be a valid 24-character hex string.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
            // onClose(); // Modal will close on success via parent component
        }
    };

    if (!isOpen) return null;

    const vehicleTypes = ['Motorcycle', 'Car', 'Bicycle', 'Other'];
    const statuses = ['available', 'on_delivery', 'offline', 'unavailable'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
                >
                    <FaTimes size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                    {initialData ? 'Edit Delivery Person' : 'Add New Delivery Person'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!initialData && ( // userId field only for new creation
                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                                User ID (from AuthService/UserService)
                            </label>
                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                placeholder="e.g., 60c7b7d0f1b2c3d4e5f6a7b8"
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00] ${errors.userId ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId}</p>}
                            <p className="text-xs text-gray-500 mt-1">
                                This should be the `_id` of an existing user account. Their role must be set to 'delivery_personnel' in MongoDB after creation.
                            </p>
                        </div>
                    )}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter name"
                            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00] ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g., 0712345678"
                            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00] ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                        <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                        <select
                            id="vehicleType"
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00] ${errors.vehicleType ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            {vehicleTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.vehicleType && <p className="text-red-500 text-xs mt-1">{errors.vehicleType}</p>}
                    </div>
                    <div>
                        <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                        <input
                            type="text"
                            id="licensePlate"
                            name="licensePlate"
                            value={formData.licensePlate}
                            onChange={handleChange}
                            placeholder="e.g., ABC-1234"
                            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00] ${errors.licensePlate ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.licensePlate && <p className="text-red-500 text-xs mt-1">{errors.licensePlate}</p>}
                    </div>
                    {initialData && ( // Status field only for edit
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00]"
                            >
                                {statuses.map(s => (
                                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#ffaa00] text-white p-3 rounded-lg hover:bg-[#e59400] transition font-semibold text-lg shadow-md hover:shadow-lg"
                    >
                        {initialData ? 'Update Delivery Person' : 'Add Delivery Person'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DeliveryPersonFormModal;
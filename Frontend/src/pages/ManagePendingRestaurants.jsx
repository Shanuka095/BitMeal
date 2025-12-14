import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useModal } from '../context/ModalContext';
import { FaCheck, FaTimes, FaStore } from 'react-icons/fa';
import PageLoader from '../components/PageLoader';

const ManagePendingRestaurants = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert, showConfirm } = useModal();

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
      
      // FIX: Point to Port 3003 (RestaurantService)
      const response = await axios.get('http://localhost:3003/api/restaurants/admin/all?status=pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPendingRequests(); }, []);

  const handleStatusUpdate = async (id, status, name) => {
    showConfirm(`Are you sure you want to ${status === 'approved' ? 'APPROVE' : 'REJECT'} ${name}?`, async () => {
        try {
            const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
            const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
            
            await axios.patch(`http://localhost:3003/api/restaurants/admin/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            showAlert(`Restaurant ${status} successfully!`);
            fetchPendingRequests();
        } catch (err) { showAlert('Failed to update status.'); }
    }, () => {});
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="text-4xl font-black text-gray-900 mb-2">Pending Approvals</h1>
      <p className="text-gray-500 mb-10">Review and approve new restaurant requests.</p>

      {requests.length === 0 ? (
        <div className="bg-white p-16 rounded-[3rem] text-center shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300 text-4xl mb-6"><FaStore /></div>
            <h3 className="text-2xl font-bold text-gray-800">No Pending Requests</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {requests.map((req) => (
                <div key={req._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <div className="flex gap-6 mb-6">
                        <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                            {req.imageUrl ? <img src={`http://localhost:3003/uploads/${req.imageUrl}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><FaStore size={30}/></div>}
                        </div>
                        <div>
                            <span className="inline-block px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-wider mb-2">Pending Review</span>
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">{req.name}</h3>
                            <p className="text-gray-500 text-sm mt-1">{req.address}</p>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-6 border-t border-gray-50">
                        <button onClick={() => handleStatusUpdate(req._id, 'approved', req.name)} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"><FaCheck /> Approve</button>
                        <button onClick={() => handleStatusUpdate(req._id, 'rejected', req.name)} className="flex-1 py-3 bg-white border-2 border-gray-100 text-gray-600 rounded-xl font-bold hover:border-red-500 hover:text-red-500 transition-colors flex items-center justify-center gap-2"><FaTimes /> Reject</button>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ManagePendingRestaurants;
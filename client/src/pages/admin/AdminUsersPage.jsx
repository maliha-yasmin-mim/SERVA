import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import Button from '../../components/common/Button';
import { Spinner } from '../../components/common/Loader';
import { Users, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (role) params.role = role;
      const data = await adminService.getUsers(params);
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Admin Console
      </Link>

      <div>
        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
          User Management
        </span>
        <h1 className="text-2xl font-extrabold text-[#17211F] font-display mt-1">
          Registered Platform Members
        </h1>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="flex gap-3 bg-white p-4 rounded-2xl border border-[#E3EAE7] shadow-soft">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by name, email, or area..."
          className="flex-1 text-xs sm:text-sm px-4 py-2 rounded-xl border border-[#E3EAE7] focus:outline-none"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="text-xs sm:text-sm p-2 rounded-xl border border-[#E3EAE7] bg-white focus:outline-none"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <Button type="submit" variant="primary" size="md">
          Search
        </Button>
      </form>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#E3EAE7] shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9F8] border-b border-[#E3EAE7] text-[#64716D] uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-4">Member</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4">Jobs Done</th>
                  <th className="p-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EAE7]">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/60">
                    <td className="p-4 flex items-center gap-3">
                      <Avatar src={u.avatar} size="sm" isOnline={u.isAvailableNow} />
                      <div>
                        <span className="font-bold text-[#17211F] block">{u.name}</span>
                        <span className="text-[11px] text-[#64716D]">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#17211F]">{u.location || 'Dhaka'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <VerificationBadge status={u.verificationStatus} size="sm" />
                    </td>
                    <td className="p-4 font-bold text-[#0F766E]">{u.completedJobsCount || 0}</td>
                    <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;

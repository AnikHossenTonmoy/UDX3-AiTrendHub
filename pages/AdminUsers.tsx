
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import { User } from '../types';

const AdminUsers = () => {
  const { users, addUser, deleteUser } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User' as 'Admin' | 'Moderator' | 'User',
    password: '', // Mock password field
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
        lastActive: 'Just now'
    };
    addUser(newUser);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'User', password: '' });
  };

  const filteredUsers = users.filter(user => {
      const matchesFilter = filter === 'All' || user.role === filter;
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
  });

  // Role Badge Helper
  const getRoleBadge = (role: string) => {
      switch(role) {
          case 'Admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
          case 'Moderator': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
          default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      }
  };

  return (
    <div className="p-6">
        {/* Header & Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Manage access, roles, and platform administrators.</p>
            </div>
            <div className="flex gap-4">
                <div className="text-center px-4 py-2 bg-white dark:bg-dark-surface rounded-xl border border-slate-100 dark:border-dark-border shadow-sm">
                    <p className="text-xs text-slate-500 uppercase font-bold">Total</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{users.length}</p>
                </div>
                <div className="text-center px-4 py-2 bg-white dark:bg-dark-surface rounded-xl border border-slate-100 dark:border-dark-border shadow-sm">
                     <p className="text-xs text-purple-500 uppercase font-bold">Admins</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{users.filter(u => u.role === 'Admin').length}</p>
                </div>
            </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white dark:bg-dark-surface p-4 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
             <div className="flex items-center gap-2 w-full sm:w-auto">
                 <div className="relative flex-1 sm:w-64">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                 </div>
                 <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                 >
                     <option value="All">All Roles</option>
                     <option value="Admin">Admins</option>
                     <option value="Moderator">Moderators</option>
                     <option value="User">Users</option>
                 </select>
             </div>
             
             <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-colors"
             >
                 <span className="material-symbols-outlined text-[20px]">person_add</span>
                 Add User
             </button>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar} alt={user.name} className="size-10 rounded-full object-cover border border-slate-200 dark:border-slate-600" />
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getRoleBadge(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                     <div className="flex items-center gap-2">
                                        <span className={`size-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                        <span className="text-sm text-slate-600 dark:text-slate-300">{user.status}</span>
                                     </div>
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                    {user.joinedDate}
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => deleteUser(user.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        title="Delete User"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                    <p>No users found matching your criteria.</p>
                </div>
            )}
        </div>

        {/* Add User Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New User">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input 
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                    <select 
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value as any})}
                        className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                        <option value="User">User</option>
                        <option value="Moderator">Moderator</option>
                        <option value="Admin">Administrator</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Temporary Password</label>
                    <input 
                        required
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                        placeholder="••••••••"
                    />
                </div>
                
                <div className="pt-2">
                    <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                        Create Account
                    </button>
                </div>
            </form>
        </Modal>
    </div>
  );
};

export default AdminUsers;

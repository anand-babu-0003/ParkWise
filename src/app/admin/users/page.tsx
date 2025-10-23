'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Eye
} from 'lucide-react';
import { useCollection, updateDoc, addDoc, deleteDoc, WithId } from '@/lib/mongodb';

// Define interfaces for different user data structures
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  createdAt: string;
}

interface UserInput {
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserUpdate {
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userType, setUserType] = useState<'all' | 'user' | 'owner'>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', email: '', role: 'user', status: 'Active', joinDate: new Date().toISOString(), createdAt: new Date().toISOString() });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: users, isLoading, mutate } = useCollection<User>('/api/users');

  const filteredUsers = users?.filter(user => {
    // Exclude admins
    if (user.role === 'admin') return false;
    
    // Filter by user type
    if (userType !== 'all' && user.role !== userType) return false;
    
    // Filter by search term
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  const userCount = users?.filter(user => user.role === 'user').length || 0;
  const ownerCount = users?.filter(user => user.role === 'owner').length || 0;

  const handleEditUser = (user: WithId<User>) => {
    // Convert the WithId<User> to User by spreading the properties
    const userToEdit: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || 'Active',
      joinDate: user.joinDate,
      createdAt: user.createdAt
    };
    setEditingUser(userToEdit);
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    try {
      // Prepare update data
      const updateData: UserUpdate = {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        status: editingUser.status
      };
      
      const result = await updateDoc<UserUpdate>(`/api/users/${editingUser.id}`, updateData);
      if (result) {
        // Refresh the data
        mutate();
        setIsEditDialogOpen(false);
        setEditingUser(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await deleteDoc(`/api/users/${userId}`);
        if (result) {
          // Refresh the data
          mutate();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleAddUser = async () => {
    try {
      // Prepare user data for creation
      const userData: UserInput = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status
      };
      
      const result = await addDoc<UserInput>('/api/users', userData);
      if (result) {
        // Refresh the data
        mutate();
        setIsAddDialogOpen(false);
        setNewUser({ name: '', email: '', role: 'user', status: 'Active', joinDate: new Date().toISOString(), createdAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleViewUser = (userId: string) => {
    console.log('View user:', userId);
    // Implement view functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users and owners in the system</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{userCount}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parking Owners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{ownerCount}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or role..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={userType === 'all' ? 'default' : 'outline'} 
                onClick={() => setUserType('all')}
              >
                All Users
              </Button>
              <Button 
                variant={userType === 'user' ? 'default' : 'outline'} 
                onClick={() => setUserType('user')}
              >
                Regular Users
              </Button>
              <Button 
                variant={userType === 'owner' ? 'default' : 'outline'} 
                onClick={() => setUserType('owner')}
              >
                Owners
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {userType === 'all' ? 'All Users & Owners' : userType === 'user' ? 'Regular Users' : 'Parking Owners'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-3 w-48 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">User</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Join Date</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          No users found matching your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{user.name}</div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'owner' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status || 'Active'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewUser(user.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select value={editingUser.role} onValueChange={(value) => setEditingUser({...editingUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editingUser.status || 'Active'} onValueChange={(value) => setEditingUser({...editingUser, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveUser}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-name">Name</Label>
              <Input
                id="add-name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Enter user name"
              />
            </div>
            <div>
              <Label htmlFor="add-email">Email</Label>
              <Input
                id="add-email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="Enter user email"
              />
            </div>
            <div>
              <Label htmlFor="add-role">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="add-status">Status</Label>
              <Select value={newUser.status} onValueChange={(value) => setNewUser({...newUser, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

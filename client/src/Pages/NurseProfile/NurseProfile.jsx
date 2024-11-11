import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaEdit, FaCheck, FaCircle } from 'react-icons/fa';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AuthContext } from '@/api/auth';
import axios from 'axios';
import { API_URL } from '@/api/config';

const NurseProfile = () => {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const [nurseData, setNurseData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});

    const getNurseData = async () => {
        try {
            const response = await axios.get(`${API_URL}/nurse/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNurseData(response.data.data);
            setEditedData(response.data.data);
        } catch (error) {
            console.error('Error fetching nurse data:', error);
        }
    };

    const handleUpdate = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }
        try {
            await axios.put(
                `${API_URL}/nurse/update-profile`,
                editedData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNurseData(editedData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    useEffect(() => {
        getNurseData();
    }, []);

    const handleInputChange = (field, value) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
    };

    const isListedOnWebsite = nurseData.IsAvailable && nurseData.Price;

    return (
        <div className="min-h-screen bg-gray-50 p-8 mt-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                {/* Status Bar */}
                <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FaCircle className={`h-3 w-3 ${isListedOnWebsite ? 'text-green-500' : 'text-red-500'}`} />
                        <span className="text-sm font-medium">
                            {isListedOnWebsite ? 'Listed on Website' : 'Not Listed on Website'}
                        </span>
                    </div>
                </div>

                {!nurseData.Price && (
                    <Alert className="mb-6 border-yellow-500 bg-yellow-50">
                        <AlertDescription>
                            You won't be listed in search results until you set your Daily rate.
                        </AlertDescription>
                    </Alert>
                )}

                <Card className="mb-6">
                    <CardHeader className="border-b">
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-full overflow-hidden">
                                <img
                                    src={nurseData.ImgUrl || '/api/placeholder/400/400'}
                                    alt={nurseData.Name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{nurseData.Name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={`h-4 w-4 ₹{i < (nurseData.Rating || 0)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="space-y-8">
                            {/* Availability Section */}
                            <section>
                                <h3 className="text-lg font-semibold mb-4">Availability & Rate</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Availability Status</label>
                                        <div className="flex items-center gap-3">
                                            {isEditing ? (
                                                <Switch
                                                    checked={editedData.IsAvailable}
                                                    onCheckedChange={(checked) => handleInputChange('IsAvailable', checked)}
                                                />
                                            ) : (
                                                <Switch
                                                    checked={nurseData.IsAvailable}
                                                    disabled
                                                />
                                            )}
                                            <span className="text-sm">
                                                {(isEditing ? editedData : nurseData).IsAvailable ? 'Available for Work' : 'Not Available'}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate</label>
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                value={editedData.Price || ''}
                                                onChange={(e) => handleInputChange('Price', e.target.value)}
                                                className="w-full"
                                                placeholder="Enter Daily rate"
                                            />
                                        ) : (
                                            <p className="text-gray-900">₹{nurseData.Price}/hr</p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Personal Information */}
                            <section>
                                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { label: 'Full Name', field: 'Name' },
                                        { label: 'Email Address', field: 'Email' },
                                        { label: 'Phone Number', field: 'PhoneNumber' },
                                        { label: 'Location', field: 'Address' },
                                        { label: 'City', field: 'City' },
                                        { label: 'State', field: 'State' }
                                    ].map(({ label, field }) => (
                                        <div key={field}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                            {isEditing ? (
                                                <Input
                                                    value={editedData[field] || ''}
                                                    onChange={(e) => handleInputChange(field, e.target.value)}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{nurseData[field]}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Professional Information */}
                            <section>
                                <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                                        {isEditing ? (
                                            <Input
                                                value={Array.isArray(editedData.Skills) ? editedData.Skills.join(', ') : ''}
                                                onChange={(e) => handleInputChange('Skills', e.target.value.split(',').map(s => s.trim()))}
                                                placeholder="Enter skills, separated by commas"
                                                className="w-full"
                                            />
                                        ) : (
                                            <p className="text-gray-900">
                                                {Array.isArray(nurseData.Skills) ? nurseData.Skills.join(', ') : 'No skills listed'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
                                        {isEditing ? (
                                            <select
                                                value={editedData.Skilled || ''}
                                                onChange={(e) => handleInputChange('Skilled', parseInt(e.target.value))}
                                                className="w-full rounded-md border border-gray-300 p-2"
                                            >
                                                <option value={1}>Skilled</option>
                                                <option value={2}>Semi-Skilled</option>
                                                <option value={3}>Unskilled</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-900">
                                                {nurseData.Skilled === 1 ? 'Skilled' :
                                                    nurseData.Skilled === 2 ? 'Semi-Skilled' : 'Unskilled'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                                        {isEditing ? (
                                            <Textarea
                                                value={editedData.AboutMe || ''}
                                                onChange={(e) => handleInputChange('AboutMe', e.target.value)}
                                                className="w-full"
                                                rows={6}
                                                placeholder="Write a brief description about yourself..."
                                            />
                                        ) : (
                                            <p className="text-gray-900">{nurseData.AboutMe}</p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 flex justify-end gap-4"
                        >
                            {isEditing && (

                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditedData(nurseData);
                                    }}
                                >
                                    Cancel
                                </Button>

                            )}

                            <Button
                                variant={isEditing ? "default" : "outline"}
                                onClick={handleUpdate}
                                className="gap-2"
                            >
                                {isEditing ? <FaCheck className="h-4 w-4" /> : <FaEdit className="h-4 w-4" />}
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </Button>
                        </motion.div>

                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default NurseProfile;
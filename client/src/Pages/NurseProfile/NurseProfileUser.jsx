import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthContext } from '@/api/auth';
import axios from 'axios';
import { API_URL } from '@/api/config';
import toast from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const NurseProfileUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [nurseData, setNurseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestForm, setRequestForm] = useState({
        reason: '',
        requirements: [],
        location: '',
        address: '',
        duration: ''
    });
    const [newRequirement, setNewRequirement] = useState('');

    useEffect(() => {
        getNurseData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addRequirement = () => {
        if (newRequirement.trim()) {
            setRequestForm(prev => ({
                ...prev,
                requirements: [...prev.requirements, newRequirement.trim()]
            }));
            setNewRequirement('');
        }
    };

    const removeRequirement = (index) => {
        setRequestForm(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addRequirement();
        }
    };

    const getNurseData = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/getNurseProfile/${id}`);
            if (response.data.status) {
                setNurseData(response.data.nurse);
            } else {
                toast.error('Failed to load nurse profile');
            }
        } catch (error) {
            console.error('Error fetching nurse data:', error);
            toast.error('Failed to load nurse profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async () => {
        if (!token) {
            toast.error('Please login to send a request');
            navigate('/login');
            return;
        }
        setShowRequestModal(true);
    };

    const submitRequest = async () => {
        if (!requestForm.reason || !requestForm.location || !requestForm.address || !requestForm.duration) {
            toast.error('Please fill all required fields');
            return;
        }

        setRequesting(true);
        try {
            const requestData = {
                nurseId: id,
                reason: requestForm.reason,
                requirements: requestForm.requirements,
                location: requestForm.location,
                address: requestForm.address,
                duration: parseInt(requestForm.duration)
            };

            const response = await axios.post(
                `${API_URL}/user/create-request`,
                requestData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status) {
                toast.success('Request sent successfully!');
                setShowRequestModal(false);
                setRequestForm({
                    reason: '',
                    requirements: [],
                    location: '',
                    address: '',
                    duration: ''
                });
            } else {
                toast.error(response.data.message || 'Failed to send request');
            }
        } catch (error) {
            console.error('Error sending request:', error);
            toast.error('Failed to send request. Please try again.');
        } finally {
            setRequesting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
            </div>
        );
    }

    if (!nurseData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Nurse Not Found</h2>
                    <p className="text-gray-600 mb-4">The nurse profile you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate('/search')}>Back to Search</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 mt-16">
            <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Send Request to Nurse</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Reason for Request *</Label>
                            <Textarea
                                id="reason"
                                name="reason"
                                value={requestForm.reason}
                                onChange={handleInputChange}
                                placeholder="Explain why you need nursing assistance"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="requirements">Special Requirements</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="requirements"
                                    value={newRequirement}
                                    onChange={(e) => setNewRequirement(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Add a requirement"
                                    className="flex-1"
                                />
                                <Button 
                                    type="button" 
                                    onClick={addRequirement}
                                    variant="outline"
                                    className="px-4"
                                >
                                    +
                                </Button>
                            </div>
                            {requestForm.requirements.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    {requestForm.requirements.map((req, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                                            <span className="flex-1">{req}</span>
                                            <Button
                                                type="button"
                                                onClick={() => removeRequirement(index)}
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                name="location"
                                value={requestForm.location}
                                onChange={handleInputChange}
                                placeholder="City or area"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Full Address *</Label>
                            <Textarea
                                id="address"
                                name="address"
                                value={requestForm.address}
                                onChange={handleInputChange}
                                placeholder="Enter your complete address"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="duration">Duration (days) *</Label>
                            <Input
                                id="duration"
                                name="duration"
                                type="number"
                                min="1"
                                value={requestForm.duration}
                                onChange={handleInputChange}
                                placeholder="Number of days required"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRequestModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={submitRequest} disabled={requesting}>
                            {requesting ? 'Sending...' : 'Send Request'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                <Card className="mb-6">
                    <CardHeader className="border-b">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100">
                                <img
                                    src={nurseData.ImgUrl || '/placeholder.png'}
                                    alt={nurseData.Name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">{nurseData.Name}</h2>
                                        <div className="flex items-center gap-2 mt-2">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={`h-5 w-5 ${
                                                        i < (nurseData.Rating || 0)
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                            <span className="text-gray-600 ml-2">
                                                ({nurseData.Rating || 0} out of 5)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-sky-700">
                                            ₹{nurseData.Price}
                                            <span className="text-sm text-gray-600">/day</span>
                                        </div>
                                        <Badge
                                            variant={nurseData.IsAvailable ? 'success' : 'destructive'}
                                            className="mt-2"
                                        >
                                            {nurseData.IsAvailable ? 'Available' : 'Not Available'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="space-y-8">
                            {/* Contact Information */}
                            <section>
                                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                                        <span>{nurseData.Address}, {nurseData.City}, {nurseData.State}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaPhone className="h-5 w-5 text-gray-400" />
                                        <span>{nurseData.PhoneNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                                        <span>{nurseData.Email}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Skills & Experience */}
                            <section>
                                <h3 className="text-xl font-semibold mb-4">Skills & Experience</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Skill Level</h4>
                                        <Badge variant="outline" className="text-lg">
                                            {nurseData.Skilled === 1 ? 'Skilled' :
                                             nurseData.Skilled === 2 ? 'Semi-Skilled' : 'Unskilled'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.isArray(nurseData.Skills) ? (
                                                nurseData.Skills.map((skill, index) => (
                                                    <Badge key={index} variant="secondary">
                                                        {skill}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-gray-600">No skills listed</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* About */}
                            <section>
                                <h3 className="text-xl font-semibold mb-4">About</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {nurseData.AboutMe || 'No description available.'}
                                </p>
                            </section>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/search')}
                                >
                                    Back to Search
                                </Button>
                                <Button
                                    onClick={handleSendRequest}
                                    disabled={!nurseData.IsAvailable}
                                    className="bg-sky-700 hover:bg-sky-800"
                                >
                                    <FaCalendarAlt className="mr-2" />
                                    Send Request
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default NurseProfileUser;

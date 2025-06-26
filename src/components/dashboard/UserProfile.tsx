import  { useState } from 'react';
import { MailIcon, PhoneIcon, KeyIcon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';
// Mock user data
const userData = {
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@example.com',
  phone: '(555) 123-4567',
  address: '123 Main St, Apt 4B',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  dateOfBirth: '1985-06-15',
  gender: 'male',
  emergencyContact: 'Jane Smith (Wife) - (555) 987-6543',
  medicalConditions: [{
    name: 'Hypertension',
    diagnosed: '2018',
    medications: 'Lisinopril 10mg'
  }, {
    name: 'High Cholesterol',
    diagnosed: '2019',
    medications: 'Atorvastatin 20mg'
  }],
  allergies: ['Penicillin', 'Peanuts']
};
const UserProfile = () => {
  const [user, setUser] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    // In a real app, this would be an API call
    setUser(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) {
      return;
    }
    // In a real app, this would be an API call
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    toast.success('Password changed successfully');
  };
  return <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 p-6 text-white">
        <h1 className="text-xl font-semibold">My Profile</h1>
        <p className="text-blue-100">
          View and update your personal information
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              {!isEditing && <button onClick={() => setIsEditing(true)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Edit Profile
                </button>}
            </div>
            {isEditing ? <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">
                        {errors.firstName}
                      </p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">
                        {errors.lastName}
                      </p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input type="text" id="state" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                  <input type="text" id="emergencyContact" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} placeholder="Name (Relationship) - Phone Number" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => {
                setIsEditing(false);
                setFormData(user);
                setErrors({});
              }} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <SaveIcon className="h-4 w-4 inline mr-1" />
                    Save Changes
                  </button>
                </div>
              </form> : <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="mt-1">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Date of Birth
                    </h3>
                    <p className="mt-1">
                      {new Date(user.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1">{user.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Gender
                    </h3>
                    <p className="mt-1 capitalize">{user.gender}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Emergency Contact
                    </h3>
                    <p className="mt-1">{user.emergencyContact}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1">
                    {user.address}, {user.city}, {user.state} {user.zipCode}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Medical Conditions
                  </h3>
                  {user.medicalConditions.length > 0 ? <div className="space-y-3">
                      {user.medicalConditions.map((condition, index) => <div key={index} className="bg-gray-50 p-3 rounded-md">
                          <p className="font-medium">{condition.name}</p>
                          <p className="text-sm text-gray-500">
                            Diagnosed: {condition.diagnosed}
                          </p>
                          <p className="text-sm text-gray-500">
                            Medications: {condition.medications}
                          </p>
                        </div>)}
                    </div> : <p className="text-gray-500 text-sm">
                      No medical conditions recorded
                    </p>}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Allergies
                  </h3>
                  {user.allergies.length > 0 ? <div className="flex flex-wrap gap-2">
                      {user.allergies.map((allergy, index) => <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          {allergy}
                        </span>)}
                    </div> : <p className="text-gray-500 text-sm">
                      No allergies recorded
                    </p>}
                </div>
              </div>}
          </div>
          {/* Security Settings */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
              {isChangingPassword ? <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input type="password" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className={`w-full px-3 py-2 border ${errors.currentPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                    {errors.currentPassword && <p className="mt-1 text-sm text-red-600">
                        {errors.currentPassword}
                      </p>}
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className={`w-full px-3 py-2 border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                    {errors.newPassword && <p className="mt-1 text-sm text-red-600">
                        {errors.newPassword}
                      </p>}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>}
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button type="button" onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setErrors({});
                }} className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                      Change Password
                    </button>
                  </div>
                </form> : <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <KeyIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm">Password</span>
                    </div>
                    <button onClick={() => setIsChangingPassword(true)} className="text-blue-600 hover:text-blue-800 text-sm">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MailIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm">Email notifications</span>
                    </div>
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input type="checkbox" checked={true} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm">SMS notifications</span>
                    </div>
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input type="checkbox" checked={false} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Account Actions
                    </h3>
                    <div className="space-y-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800 block">
                        Download my data
                      </button>
                      <button className="text-sm text-red-600 hover:text-red-800 block">
                        Delete my account
                      </button>
                    </div>
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default UserProfile;
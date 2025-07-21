import { useState, useEffect } from 'react';
import { MailIcon, PhoneIcon, KeyIcon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  id?: number;
  uniqId?: string;
  fullName: string;
  email: string;
  gender: string;
  dateOfBirthDay: string | null;
  age: number;
  contact: string;
  address: string;
  city: string;
  status?: string;
  roleId?: number;
}

const UserProfile = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [user, setUser] = useState<UserData>({
    fullName: '',
    email: '',
    gender: 'Male',
    dateOfBirthDay: null,
    age: 0,
    contact: '',
    address: '',
    city: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState<UserData>(user);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          toast.error('Authentication token not found');
          setIsLoading(false);
          return;
        }

        const email = localStorage.getItem('userEmail');
        if (!email) {
          toast.error('User email not found');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${baseUrl}patient?email=${email}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.code === 200 && data.data) {
          const userData: UserData = {
            id: data.data.id,
            uniqId: data.data.uniqId,
            fullName: data.data.fullName || '',
            email: data.data.email || '',
            gender: data.data.gender === 'Empty' ? 'Male' : data.data.gender || 'Male',
            dateOfBirthDay: data.data.dateOfBirthDay || null,
            age: data.data.age || 0,
            contact: data.data.contact === 'Empty' ? '' : data.data.contact || '',
            address: data.data.address === 'Empty' ? '' : data.data.address || '',
            city: data.data.city || '',
            status: data.data.status,
            roleId: data.data.roleId
          };

          setUser(userData);
          setFormData(userData);

          if (userData.id) {
            localStorage.setItem('userId', userData.id.toString());
          }
        } else {
          throw new Error(data.message || 'Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchCities();
  },[]);




  const fetchCities = async () => {
    try {
      const response = await fetch(
          "https://secure.geonames.org/searchJSON?country=LK&featureClass=P&maxRows=1000&username=gihanmadushanka807"
      );
      const data = await response.json();

      const cityNames = data.geonames.map((city: any) => city.name);
      const uniqueCities = [...new Set(cityNames)].sort();
      setCitySuggestions(uniqueCities);
    } catch (err) {
      console.error("Failed to fetch cities", err);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.contact) {
      newErrors.contact = 'Contact number is required';
    }
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    if (!formData.dateOfBirthDay) {
      newErrors.dateOfBirthDay = 'Date of birth is required';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      // Format date to YYYY-MM-DD
      const formattedDate = formData.dateOfBirthDay
          ? new Date(formData.dateOfBirthDay).toISOString().split('T')[0]
          : null;

      const userData = {
        id: formData.id,
        uniqId: "empty",
        fullName: formData.fullName,
        email: formData.email,
        password: "empty",
        gender: formData.gender,
        dateOfBirthDay: formattedDate,
        age: formData.age,
        contact: formData.contact,
        address: formData.address,
        city: formData.city,
        status: "Active",
        roleId: 3
      };

      const token = localStorage.getItem('jwt');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(`${baseUrl}patient/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const responseData = await response.json();

      if (response.ok && responseData.code === 200) {
        setUser(formData);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        throw new Error(responseData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      const userId = localStorage.getItem('userId'); // Get userId from localStorage

      if (!token || !userId) {
        toast.error('Authentication token or user ID not found');
        return;
      }

      const passwordUpdateData = {
        userId: parseInt(userId), // Convert to number
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };

      const response = await fetch(`${baseUrl}patient/updatePw`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordUpdateData)
      });

      const responseData = await response.json();

      if (response.ok && responseData.code === 200) {
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        toast.success('Password changed successfully');
      } else {
        throw new Error(responseData.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
                )}
              </div>
              {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.fullName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.fullName}
                          </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="dateOfBirthDay" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                          type="date"
                          id="dateOfBirthDay"
                          name="dateOfBirthDay"
                          value={formData.dateOfBirthDay ? formData.dateOfBirthDay.slice(0, 10) : ''}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${errors.dateOfBirthDay ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.dateOfBirthDay && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.dateOfBirthDay}
                          </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <input
                          type="number"
                          id="age"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <input
                          type="tel"
                          id="contact"
                          name="contact"
                          value={formData.contact}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${errors.contact ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.contact && (
                          <p className="mt-1 text-sm text-red-600">{errors.contact}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.address && (
                          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                          list="cityOptions"
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${errors.city ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />

                      <datalist id="cityOptions">
                        {citySuggestions.map((city, index) => (
                            <option key={index} value={city} />
                        ))}
                      </datalist>
{/*                      <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${errors.city ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />*/}
                      {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData(user);
                            setErrors({});
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <SaveIcon className="h-4 w-4 inline mr-1" />
                        Save Changes
                      </button>
                    </div>
                  </form>
              ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p className="mt-1">{user.fullName || 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-1">{user.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                        <p className="mt-1">{user.gender || 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                        <p className="mt-1">{user.dateOfBirthDay ? new Date(user.dateOfBirthDay).toLocaleDateString() : 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Age</h3>
                        <p className="mt-1">{user.age || 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                        <p className="mt-1">{user.contact || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p className="mt-1">
                        {user.address || 'Not provided'}{user.address && user.city ? ', ' : ''}{user.city || (user.address ? '' : 'Not provided')}
                      </p>
                    </div>
                  </div>
              )}
            </div>

            {/* Security Settings */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
                {isChangingPassword ? (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className={`w-full px-3 py-2 border ${errors.currentPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.currentPassword}
                            </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className={`w-full px-3 py-2 border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.newPassword}
                            </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.confirmPassword}
                            </p>
                        )}
                      </div>
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                              setIsChangingPassword(false);
                              setPasswordData({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                              });
                              setErrors({});
                            }}
                            className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        >
                          Change Password
                        </button>
                      </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <KeyIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm">Password</span>
                        </div>
                        <button
                            onClick={() => setIsChangingPassword(true)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Change
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MailIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm">Email notifications</span>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input
                              type="checkbox"
                              checked={emailNotifications}
                              onChange={() => setEmailNotifications(!emailNotifications)}
                              className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm">SMS notifications</span>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input
                              type="checkbox"
                              checked={smsNotifications}
                              onChange={() => setSmsNotifications(!smsNotifications)}
                              className="sr-only peer"
                          />
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
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserProfile;
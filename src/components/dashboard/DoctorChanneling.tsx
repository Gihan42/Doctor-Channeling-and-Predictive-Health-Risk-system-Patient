import { useState, Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, UserIcon, CheckCircleIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Specialization {
  id: number;
  specializationName: string;
  status: string;
}

interface SpecializationResponse {
  code: number;
  message: string;
  data: Specialization[];
}

interface MedicalCenter {
  id: number;
  address: string;
  email: string;
  distric: string;
  closeTime: string;
  contact2: string;
  contact1: string;
  openTime: string;
  centerName: string;
  channelingFee: number;
  centerType: string;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  medicalCenter: string;
  image: string;
  rating: number;
  experience: string;
  availableDates: Date[];
  availableSlots: string[];
}

const DoctorChanneling = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedSpecialization, setSelectedSpecialization] = useState<number | null>(null);
  const [selectedMedicalCenter, setSelectedMedicalCenter] = useState<number | null>(null);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [medicalCenters, setMedicalCenters] = useState<MedicalCenter[]>([]);
  const [showNearestCenters, setShowNearestCenters] = useState(false);
  const [nearestCenters, setNearestCenters] = useState<MedicalCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [medicalCentersLoading, setMedicalCentersLoading] = useState(false);
  const [nearestCentersLoading, setNearestCentersLoading] = useState(false);
  const [error, setError] = useState('');
  const [medicalCentersError, setMedicalCentersError] = useState('');
  const [nearestCentersError, setNearestCentersError] = useState('');

  // Mock doctors data - replace with real API data later
  const doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      medicalCenter: 'Bright Smile Dental Clinic',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      rating: 4.8,
      experience: '15 years',
      availableDates: [new Date(new Date().setDate(new Date().getDate() + 1)), new Date(new Date().setDate(new Date().getDate() + 2)), new Date(new Date().setDate(new Date().getDate() + 3))],
      availableSlots: ['09:00 AM', '10:30 AM', '11:45 AM', '02:00 PM', '03:30 PM', '04:45 PM']
    },
    // ... other mock doctors
  ];

  // Fetch specializations on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt');

        if (!token) {
          throw new Error('Authentication required. Please login.');
        }

        const response = await fetch('http://localhost:8080/api/v1/specialization/getAll', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('jwt');
            localStorage.removeItem('selectedSpecialization');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch specializations');
        }

        const data: SpecializationResponse = await response.json();

        if (data.code === 200) {
          setSpecializations(data.data);
        } else {
          throw new Error(data.message || 'Failed to load specializations');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching specializations:', err);

        if (err instanceof Error && err.message.includes('Authentication')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSpecializations();
  }, [navigate]);

  // Fetch medical centers when step changes to 2
  useEffect(() => {
    if (step === 2 && !showNearestCenters) {
      const fetchMedicalCenters = async () => {
        try {
          setMedicalCentersLoading(true);
          setMedicalCentersError('');

          const storedSpecialization = localStorage.getItem('selectedSpecialization');
          if (!storedSpecialization) {
            throw new Error('No specialization selected');
          }

          const { name } = JSON.parse(storedSpecialization);
          const token = localStorage.getItem('jwt');

          if (!token) {
            throw new Error('Authentication required');
          }

          const response = await fetch(
              `http://localhost:8080/api/v1/specialization?specializationName=${encodeURIComponent(name)}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch medical centers');
          }

          const data = await response.json();

          if (data.code === 200 && data.data) {
            setMedicalCenters(data.data);
          } else {
            throw new Error(data.message || 'No medical centers found');
          }
        } catch (err) {
          setMedicalCentersError(err instanceof Error ? err.message : 'Failed to load medical centers');
          console.error('Error fetching medical centers:', err);
        } finally {
          setMedicalCentersLoading(false);
        }
      };

      fetchMedicalCenters();
    }
  }, [step, showNearestCenters]);

  // Handle finding nearest centers
  const handleFindNearestCenters = async () => {
    try {
      setNearestCentersLoading(true);
      setNearestCentersError('');

      const userId = localStorage.getItem('id');
      if (!userId) {
        throw new Error('User ID not found');
      }

      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`http://localhost:8080/api/v1/medical/center?id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch nearest centers');
      }

      const data = await response.json();

      if (data.code === 200 && data.data) {
        setNearestCenters(data.data);
        setShowNearestCenters(true);
      } else {
        throw new Error(data.message || 'No nearest centers found');
      }
    } catch (err) {
      setNearestCentersError(err instanceof Error ? err.message : 'Failed to load nearest centers');
      console.error('Error fetching nearest centers:', err);
    } finally {
      setNearestCentersLoading(false);
    }
  };

  // Handle going back to all centers view
  const handleBackToAllCenters = () => {
    setShowNearestCenters(false);
    setNearestCenters([]);
  };

  // Handle specialization selection
  const handleSpecializationSelect = (id: number) => {
    const selectedSpec = specializations.find(spec => spec.id === id);
    if (selectedSpec) {
      localStorage.setItem('selectedSpecialization', JSON.stringify({
        id: selectedSpec.id,
        name: selectedSpec.specializationName
      }));
      setSelectedSpecialization(id);
      setStep(2);
      setSelectedMedicalCenter(null);
      setSelectedDoctor(null);
      setSelectedDate(null);
      setSelectedTimeSlot(null);
    }
  };

  // Handle medical center selection
  const handleMedicalCenterSelect = (id: number) => {
    setSelectedMedicalCenter(id);
    const selectedCenter = medicalCenters.find(center => center.id === id)?.centerName ||
        nearestCenters.find(center => center.id === id)?.centerName;
    const selectedSpec = specializations.find(spec => spec.id === selectedSpecialization)?.specializationName;

    // Filter doctors based on specialization and medical center
    const filtered = doctors.filter(doctor =>
        doctor.specialization === selectedSpec &&
        doctor.medicalCenter === selectedCenter
    );

    setFilteredDoctors(filtered);
    setStep(3);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep(4);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setStep(5);
    setSelectedTimeSlot(null);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slot: string) => {
    setSelectedTimeSlot(slot);
  };

  // Proceed to payment
  const handleProceedToPayment = () => {
    const selectedCenter = medicalCenters.find(center => center.id === selectedMedicalCenter) ||
        nearestCenters.find(center => center.id === selectedMedicalCenter);

    navigate('/dashboard/payment', {
      state: {
        doctor: selectedDoctor,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        medicalCenter: selectedCenter?.centerName,
        fee: selectedCenter?.channelingFee
      }
    });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (time: string) => {
    return time.substring(0, 5); // Just show hours and minutes
  };

  // Go back to previous step
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setShowNearestCenters(false);
    }
  };

  return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-xl font-semibold">Channel a Doctor</h1>
          <p className="text-blue-100">Book an appointment with a specialist</p>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map(stepNum => (
                <Fragment key={stepNum}>
                  <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${stepNum <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} ${stepNum < step ? 'cursor-pointer' : ''}`}
                      onClick={() => stepNum < step && setStep(stepNum)}
                  >
                    {stepNum < step ? <CheckCircleIcon className="h-5 w-5" /> : <span className="text-sm">{stepNum}</span>}
                  </div>
                  {stepNum < 5 && <div className={`flex-1 h-1 mx-2 ${stepNum < step ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
                </Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <div className="w-16 text-center">Specialization</div>
            <div className="w-16 text-center">Location</div>
            <div className="w-16 text-center">Doctor</div>
            <div className="w-16 text-center">Date</div>
            <div className="w-16 text-center">Time</div>
          </div>
        </div>

        {/* Content based on step */}
        <div className="p-6">
          {/* Step 1: Select Specialization */}
          {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Select Specialization</h2>

                {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2">Loading specializations...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">
                      <p>Error loading specializations: {error}</p>
                      <button
                          onClick={() => window.location.reload()}
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Retry
                      </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {specializations.map(spec => (
                          <div
                              key={spec.id}
                              onClick={() => handleSpecializationSelect(spec.id)}
                              className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${selectedSpecialization === spec.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                          >
                            <h3 className="font-medium">{spec.specializationName}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Status: {spec.status}
                            </p>
                          </div>
                      ))}
                    </div>
                )}
              </div>
          )}

          {/* Step 2: Select Medical Center */}
          {step === 2 && (
              <div>
                <button onClick={goBack} className="text-blue-600 mb-4 flex items-center text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Specializations
                </button>
                <h2 className="text-lg font-semibold mb-4">Select Medical Center</h2>

                {showNearestCenters ? (
                    <>
                      <button
                          onClick={handleBackToAllCenters}
                          className="text-blue-600 mb-4 flex items-center text-sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to All Centers
                      </button>

                      {nearestCentersLoading ? (
                          <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-2">Loading nearest centers...</span>
                          </div>
                      ) : nearestCentersError ? (
                          <div className="text-center py-8 text-red-500">
                            <p>Error loading nearest centers: {nearestCentersError}</p>
                            <button
                                onClick={handleFindNearestCenters}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Retry
                            </button>
                          </div>
                      ) : (
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                              Nearest Medical Centers
                            </h3>
                            {nearestCenters.map(center => (
                                <div
                                    key={center.id}
                                    onClick={() => handleMedicalCenterSelect(center.id)}
                                    className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${selectedMedicalCenter === center.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                >
                                  <h4 className="font-medium">{center.centerName}</h4>
                                  <div className="mt-2 space-y-1">
                                    <p className="text-sm text-gray-500">{center.address}</p>
                                    <p className="text-sm text-gray-500">Contact: {center.contact1}</p>
                                    <div className="flex justify-between">
                                      <p className="text-sm text-gray-500">
                                        Open: {formatTime(center.openTime)} - {formatTime(center.closeTime)}
                                      </p>
                                      <p className="text-sm font-medium text-blue-600">
                                        Fee: Rs. {center.channelingFee.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                            ))}
                          </div>
                      )}
                    </>
                ) : (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Use Current Location
                        </label>
                        <button
                            onClick={handleFindNearestCenters}
                            className="flex items-center px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50"
                        >
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          Find Nearest Centers
                        </button>
                      </div>

                      {medicalCentersLoading ? (
                          <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-2">Loading medical centers...</span>
                          </div>
                      ) : medicalCentersError ? (
                          <div className="text-center py-8 text-red-500">
                            <p>Error loading medical centers: {medicalCentersError}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Retry
                            </button>
                          </div>
                      ) : (
                          <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                              Available Medical Centers
                            </h3>
                            <div className="space-y-3">
                              {medicalCenters.map(center => (
                                  <div
                                      key={center.id}
                                      onClick={() => handleMedicalCenterSelect(center.id)}
                                      className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${selectedMedicalCenter === center.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                  >
                                    <h4 className="font-medium">{center.centerName}</h4>
                                    <div className="mt-2 space-y-1">
                                      <p className="text-sm text-gray-500">{center.address}</p>
                                      <p className="text-sm text-gray-500">Contact: {center.contact1}</p>
                                      <div className="flex justify-between">
                                        <p className="text-sm text-gray-500">
                                          Open: {formatTime(center.openTime)} - {formatTime(center.closeTime)}
                                        </p>
                                        <p className="text-sm font-medium text-blue-600">
                                          Fee: Rs. {center.channelingFee.toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                              ))}
                            </div>
                          </div>
                      )}
                    </>
                )}
              </div>
          )}

          {/* Step 3: Select Doctor */}
          {step === 3 && (
              <div>
                <button onClick={goBack} className="text-blue-600 mb-4 flex items-center text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Medical Centers
                </button>
                <h2 className="text-lg font-semibold mb-4">Select Doctor</h2>
                {filteredDoctors.length > 0 ? (
                    <div className="space-y-4">
                      {filteredDoctors.map(doctor => (
                          <div
                              key={doctor.id}
                              onClick={() => handleDoctorSelect(doctor)}
                              className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${selectedDoctor?.id === doctor.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                          >
                            <div className="flex items-center">
                              <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
                              <div className="ml-4">
                                <h3 className="font-medium">{doctor.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {doctor.specialization}
                                </p>
                                <div className="flex items-center mt-1">
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                    <span className="text-sm text-gray-600 ml-1">
                              {doctor.rating}
                            </span>
                                  </div>
                                  <span className="mx-2 text-gray-300">•</span>
                                  <span className="text-sm text-gray-600">
                            {doctor.experience} experience
                          </span>
                                </div>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                      <UserIcon className="h-10 w-10 text-gray-400 mx-auto" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No doctors available
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try selecting a different specialization or medical center.
                      </p>
                    </div>
                )}
              </div>
          )}

          {/* Step 4: Select Date */}
          {step === 4 && selectedDoctor && (
              <div>
                <button onClick={goBack} className="text-blue-600 mb-4 flex items-center text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Doctors
                </button>
                <div className="flex items-center mb-6">
                  <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-16 h-16 rounded-full object-cover" />
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{selectedDoctor.name}</h2>
                    <p className="text-gray-600">{selectedDoctor.specialization}</p>
                  </div>
                </div>
                <h3 className="font-medium mb-4">Select Appointment Date</h3>
                <div className="mb-6">
                  <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date) => handleDateSelect(date)}
                      includeDates={selectedDoctor.availableDates}
                      minDate={new Date()}
                      inline
                      className="border rounded-md"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 inline mr-1" />
                  Available dates are highlighted on the calendar
                </div>
              </div>
          )}

          {/* Step 5: Select Time Slot */}
          {step === 5 && selectedDoctor && selectedDate && (
              <div>
                <button onClick={goBack} className="text-blue-600 mb-4 flex items-center text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Date Selection
                </button>
                <div className="flex items-center mb-4">
                  <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="ml-3">
                    <h2 className="font-medium">{selectedDoctor.name}</h2>
                    <p className="text-sm text-gray-600">
                      {selectedDoctor.specialization}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-md mb-6">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-blue-700">
                  {formatDate(selectedDate)}
                </span>
                  </div>
                </div>
                <h3 className="font-medium mb-4">Select Time Slot</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {selectedDoctor.availableSlots.map(slot => (
                      <button
                          key={slot}
                          onClick={() => handleTimeSlotSelect(slot)}
                          className={`py-2 px-4 border rounded-md text-center ${selectedTimeSlot === slot ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-blue-50'}`}
                      >
                        {slot}
                      </button>
                  ))}
                </div>
                <button
                    onClick={handleProceedToPayment}
                    disabled={!selectedTimeSlot}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                </button>
              </div>
          )}
        </div>
      </div>
  );
};

export default DoctorChanneling;
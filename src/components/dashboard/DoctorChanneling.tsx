import { useState, Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, UserIcon, CheckCircleIcon, User, UserCheck, UserCog, UserX } from 'lucide-react';
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
  medicleCenterId: number;
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
  uniqId: string;
  fullName: string;
  gender: string;
  contact: string;
  address1: string;
  address2: string;
  nic: string;
  email: string;
  medicalRegistrationNo: string;
  yearsOfExperience: number;
  hospitalAffiliation: string;
  qualificationId: number;
  specializationId: number;
  status: string;
  doctorFee: number;
  roleId: number;
  patientCount: number;
  image?: string;
}

interface DoctorResponse {
  code: number;
  message: string;
  data: Doctor[];
}

interface ScheduleResponse {
  code: number;
  message: string;
  data: string[];
}

interface TimeSlotResponse {
  code: number;
  message: string;
  data: string[];
}

const DoctorChanneling = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedSpecialization, setSelectedSpecialization] = useState<number | null>(null);
  const [selectedMedicalCenter, setSelectedMedicalCenter] = useState<number | null>(null);
  const [selectedMedicalCenterData, setSelectedMedicalCenterData] = useState<MedicalCenter | null>(null);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
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
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [hasMedicalCenters, setHasMedicalCenters] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [timeSlotsLoading, setTimeSlotsLoading] = useState(false);

  // Fetch specializations on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt');

        if (!token) {
          throw new Error('Authentication required. Please login.');
        }

        const response = await fetch(`${baseUrl}specialization/getAll`, {
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

          const { id, name } = JSON.parse(storedSpecialization);
          const token = localStorage.getItem('jwt');

          if (!token) {
            throw new Error('Authentication required');
          }

          const response = await fetch(
            `${baseUrl}specialization?specializationName=${encodeURIComponent(name)}`,
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
          console.log(data)
          if (data.code === 200 && data.data) {
            setMedicalCenters(data.data);
            setHasMedicalCenters(data.data.length > 0);
          } else {
            throw new Error(data.message || 'No medical centers found');
          }
        } catch (err) {
          setMedicalCentersError(err instanceof Error ? err.message : 'Failed to load medical centers');
          console.error('Error fetching medical centers:', err);
          setHasMedicalCenters(false);
        } finally {
          setMedicalCentersLoading(false);
        }
      };

      fetchMedicalCenters();
    }
  }, [step, showNearestCenters]);

  // Fetch doctors by medical center ID
  const fetchDoctorsByMedicalCenter = async (medicalCenterId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt');

      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      // Get specialization ID from localStorage
      const storedSpecialization = localStorage.getItem('selectedSpecialization');
      if (!storedSpecialization) {
        throw new Error('No specialization selected');
      }

      const { id } = JSON.parse(storedSpecialization);

      const response = await fetch(
        `${baseUrl}doctor?medicleCenterId=${medicalCenterId}&specializationId=${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('jwt');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch doctors');
      }

      const data: DoctorResponse = await response.json();

      if (data.code === 200) {
        setFilteredDoctors(data.data);
      } else {
        throw new Error(data.message || 'Failed to load doctors');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctor schedule
  const fetchDoctorSchedule = async (doctorId: number, medicalCenterId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt');

      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      const response = await fetch(
        `${baseUrl}channeling/room/schedule?doctorId=${doctorId}&medcleCenterId=${medicalCenterId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch doctor schedule');
      }

      const data: ScheduleResponse = await response.json();

      if (data.code === 200) {
        setAvailableDays(data.data);
      } else {
        throw new Error(data.message || 'Failed to load schedule');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching doctor schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available time slots
  const fetchAvailableTimeSlots = async (doctorId: number, date: Date) => {
    try {
      setTimeSlotsLoading(true);
      const token = localStorage.getItem('jwt');

      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      // Format date as YYYY-MM-DD
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

      const response = await fetch(
        `${baseUrl}channeling/room/schedule?doctorId=${doctorId}&dayOfWeek=${dayOfWeek}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch available time slots');
      }

      const data: TimeSlotResponse = await response.json();

      if (data.code === 200) {
        setAvailableTimeSlots(data.data);
      } else {
        throw new Error(data.message || 'Failed to load time slots');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching time slots:', err);
    } finally {
      setTimeSlotsLoading(false);
    }
  };

  // Check if date is available
  const isDateAvailable = (date: Date) => {
    if (availableDays.length === 0) return false;

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return availableDays.includes(dayName);
  };

  // Handle date selection
  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    // Save selected date to sessionStorage
    sessionStorage.setItem('selectedDate', date.toString());

    // Also save the day name (e.g., "Tuesday")
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    sessionStorage.setItem('selectedDay', dayName);

    if (selectedDoctor && selectedMedicalCenter) {
      await fetchAvailableTimeSlots(selectedDoctor.id, date);
    }

    setStep(5);
    setSelectedTimeSlot(null);
  };

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

      const response = await fetch(`${baseUrl}medical/center?id=${userId}`, {
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
        const formattedCenters = data.data.map((center: any) => ({
          ...center,
          medicleCenterId: center.medicleCenterId || center.id,
        }));
        setNearestCenters(formattedCenters);
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
    setSelectedMedicalCenter(null);
    setSelectedMedicalCenterData(null);
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
      setSelectedMedicalCenterData(null);
      setSelectedDoctor(null);
      setSelectedDate(null);
      setSelectedTimeSlot(null);
    }
  };

  // Handle medical center selection
  const handleMedicalCenterSelect = (medicleCenterId: number) => {
    console.log(medicleCenterId);

    const center = medicalCenters.find(center => center.medicleCenterId === medicleCenterId) ||
      nearestCenters.find(center => center.medicleCenterId === medicleCenterId);

    if (center) {
      setSelectedMedicalCenter(medicleCenterId);
      setSelectedMedicalCenterData(center);

      // Save medicalCenterId to sessionStorage
      sessionStorage.setItem('medicalCenterId', medicleCenterId.toString());

      fetchDoctorsByMedicalCenter(medicleCenterId);
      setStep(3);
      setSelectedDoctor(null);
      setSelectedDate(null);
      setSelectedTimeSlot(null);
    }
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor: Doctor) => {
    if (!selectedMedicalCenter) return;

    const selectedDoc = {
      id: doctor.id,
      name: doctor.fullName,
      specialization: specializations.find(spec => spec.id === doctor.specializationId)?.specializationName || 'Unknown',
      medicalCenter: selectedMedicalCenterData?.centerName || 'Unknown',
      image: doctor.image || (doctor.gender.toLowerCase() === 'female' ? 'female-icon' : 'male-icon'),
      gender: doctor.gender, // Add gender here
      rating: 4.5,
      experience: `${doctor.yearsOfExperience} years`
    };

    setSelectedDoctor(selectedDoc);
    // Save doctor ID to sessionStorage
    sessionStorage.setItem('selectedDoctorId', doctor.id.toString());

    fetchDoctorSchedule(doctor.id, selectedMedicalCenter);
    setStep(4);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slot: string) => {
    setSelectedTimeSlot(slot);
  };

  // Proceed to payment
  const handleProceedToPayment = () => {
    if (!selectedMedicalCenterData || !selectedDoctor || !selectedDate || !selectedTimeSlot) {
      console.error('Required data missing for payment');
      return;
    }
    const selectedDoctorData = filteredDoctors.find(doc => doc.id === selectedDoctor.id);
    navigate('/dashboard/payment', {
      state: {
        doctor: selectedDoctor,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        medicalCenter: selectedMedicalCenterData.centerName,
        medicalCenterId: selectedMedicalCenterData.medicleCenterId,
        medicalCenterData: selectedMedicalCenterData,
        medicalCenterFee: selectedMedicalCenterData.channelingFee,
        doctorFee: selectedDoctorData?.doctorFee || 0 // Add doctor fee here
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
    return time.substring(0, 5);
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
                        onClick={() => handleMedicalCenterSelect(center.medicleCenterId)}
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
                    disabled={!hasMedicalCenters || medicalCentersLoading}
                    className={`flex items-center px-4 py-2 border rounded-md ${hasMedicalCenters ? 'border-blue-500 text-blue-600 hover:bg-blue-50' : 'border-gray-300 text-gray-400 cursor-not-allowed'}`}
                  >
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    Find Nearest Centers
                  </button>
                  {!hasMedicalCenters && !medicalCentersLoading && (
                    <p className="mt-1 text-sm text-gray-500">
                      No medical centers available for this specialization
                    </p>
                  )}
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
                ) : hasMedicalCenters ? (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Available Medical Centers
                    </h3>
                    <div className="space-y-3">
                      {medicalCenters.map(center => (
                        <div
                          key={center.id}
                          onClick={() => {
                            console.log(center);
                            console.log(center.medicleCenterId);
                            handleMedicalCenterSelect(center.medicleCenterId);
                          }}
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
                ) : (
                  <div className="text-center py-8">
                    <MapPinIcon className="h-10 w-10 text-gray-400 mx-auto" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No medical centers available
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      There are no medical centers offering this specialization.
                    </p>
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
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Loading doctors...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>Error loading doctors: {error}</p>
                <button
                  onClick={() => fetchDoctorsByMedicalCenter(selectedMedicalCenter!)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            ) : filteredDoctors.length > 0 ? (
              <div className="space-y-4">
                {filteredDoctors.map(doctor => (
                  <div
                    key={doctor.id}
                    onClick={() => handleDoctorSelect(doctor)}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${selectedDoctor?.id === doctor.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center">
                      {doctor.gender.toLowerCase() === 'female' ? (
                        <User className="w-16 h-16 rounded-full object-cover p-2 bg-pink-100 text-pink-600" />
                      ) : (
                        <User className="w-16 h-16 rounded-full object-cover p-2 bg-blue-100 text-blue-600" />
                      )}
                      <div className="ml-4">
                        <h3 className="font-medium">{doctor.fullName}</h3>
                        <p className="text-sm text-gray-500">
                          Registration: {doctor.medicalRegistrationNo}
                        </p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-500">
                            Experience: {doctor.yearsOfExperience} years
                          </p>
                          <p className="text-sm text-gray-500">
                            Gender: {doctor.gender}
                          </p>
                          <p className="text-sm text-gray-500">
                            Contact: {doctor.contact}
                          </p>
                          <p className="text-sm font-medium text-blue-600">
                            Fee: Rs. {doctor.doctorFee.toFixed(2)}
                          </p>
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
                  No doctors available at this center
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try selecting a different medical center.
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
              {selectedDoctor.gender.toLowerCase() === 'female' ? (
                <User className="w-16 h-16 rounded-full object-cover p-2 bg-pink-100 text-pink-600" />
              ) : (
                <User className="w-16 h-16 rounded-full object-cover p-2 bg-blue-100 text-blue-600" />
              )}
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
                filterDate={isDateAvailable}
                minDate={new Date()}
                inline
                className="border rounded-md"
                dayClassName={(date) =>
                  isDateAvailable(date) ? 'available-day' : 'unavailable-day'
                }
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
              {selectedDoctor.gender.toLowerCase() === 'female' ? (
                <User className="w-12 h-12 rounded-full object-cover p-2 bg-pink-100 text-pink-600" />
              ) : (
                <User className="w-12 h-12 rounded-full object-cover p-2 bg-blue-100 text-blue-600" />
              )}
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

            {timeSlotsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Loading available time slots...</span>
              </div>
            ) : availableTimeSlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {availableTimeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => handleTimeSlotSelect(slot)}
                    className={`py-2 px-4 border rounded-md text-center ${selectedTimeSlot === slot ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-blue-50'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No available time slots for this date
              </div>
            )}

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

      {/* Add CSS for date picker */}
      <style>
        {`
          .react-datepicker__day--available-day {
            background-color: #f0fdf4;
            color: #166534;
          }
          .react-datepicker__day--unavailable-day {
            color: #d1d5db;
            pointer-events: none;
            text-decoration: line-through;
          }
        `}
      </style>
    </div>
  );
};

export default DoctorChanneling;
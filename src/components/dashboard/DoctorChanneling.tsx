import  { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, UserIcon, CheckCircleIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// Mock data
const specializations = [{
  id: 1,
  name: 'Cardiology',
  description: 'Heart and cardiovascular system'
}, {
  id: 2,
  name: 'Oncology',
  description: 'Cancer diagnosis and treatment'
}, {
  id: 3,
  name: 'Neurology',
  description: 'Brain and nervous system'
}, {
  id: 4,
  name: 'Pulmonology',
  description: 'Lungs and respiratory system'
}, {
  id: 5,
  name: 'Endocrinology',
  description: 'Hormones and metabolism'
}];
const medicalCenters = [{
  id: 1,
  name: 'Heart Care Center',
  address: '123 Medical Ave, City',
  distance: '2.5 miles'
}, {
  id: 2,
  name: 'Cancer Treatment Institute',
  address: '456 Health St, City',
  distance: '3.8 miles'
}, {
  id: 3,
  name: 'General Hospital',
  address: '789 Care Blvd, City',
  distance: '1.2 miles'
}, {
  id: 4,
  name: 'Medical Research Center',
  address: '101 Science Dr, City',
  distance: '5.0 miles'
}];
const doctors = [{
  id: 1,
  name: 'Dr. Sarah Johnson',
  specialization: 'Cardiology',
  medicalCenter: 'Heart Care Center',
  image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
  rating: 4.8,
  experience: '15 years',
  availableDates: [new Date(new Date().setDate(new Date().getDate() + 1)), new Date(new Date().setDate(new Date().getDate() + 2)), new Date(new Date().setDate(new Date().getDate() + 3))],
  availableSlots: ['09:00 AM', '10:30 AM', '11:45 AM', '02:00 PM', '03:30 PM', '04:45 PM']
}, {
  id: 2,
  name: 'Dr. Michael Chen',
  specialization: 'Oncology',
  medicalCenter: 'Cancer Treatment Institute',
  image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
  rating: 4.9,
  experience: '12 years',
  availableDates: [new Date(new Date().setDate(new Date().getDate() + 2)), new Date(new Date().setDate(new Date().getDate() + 4)), new Date(new Date().setDate(new Date().getDate() + 5))],
  availableSlots: ['08:30 AM', '10:00 AM', '11:15 AM', '01:30 PM', '03:00 PM', '04:15 PM']
}, {
  id: 3,
  name: 'Dr. Emily Rodriguez',
  specialization: 'Cardiology',
  medicalCenter: 'General Hospital',
  image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
  rating: 4.7,
  experience: '10 years',
  availableDates: [new Date(new Date().setDate(new Date().getDate() + 1)), new Date(new Date().setDate(new Date().getDate() + 3)), new Date(new Date().setDate(new Date().getDate() + 4))],
  availableSlots: ['09:30 AM', '11:00 AM', '12:15 PM', '02:30 PM', '04:00 PM', '05:15 PM']
}, {
  id: 4,
  name: 'Dr. James Wilson',
  specialization: 'Oncology',
  medicalCenter: 'Medical Research Center',
  image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
  rating: 4.6,
  experience: '18 years',
  availableDates: [new Date(new Date().setDate(new Date().getDate() + 2)), new Date(new Date().setDate(new Date().getDate() + 3)), new Date(new Date().setDate(new Date().getDate() + 5))],
  availableSlots: ['08:15 AM', '09:45 AM', '11:30 AM', '01:45 PM', '03:15 PM', '04:30 PM']
}];
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
  // Handle specialization selection
  const handleSpecializationSelect = (id: number) => {
    setSelectedSpecialization(id);
    setStep(2);
    // Reset subsequent selections
    setSelectedMedicalCenter(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };
  // Handle medical center selection
  const handleMedicalCenterSelect = (id: number) => {
    setSelectedMedicalCenter(id);
    const selectedCenter = medicalCenters.find(center => center.id === id)?.name;
    const selectedSpec = specializations.find(spec => spec.id === selectedSpecialization)?.name;
    // Filter doctors based on specialization and medical center
    const filtered = doctors.filter(doctor => doctor.specialization === selectedSpec && doctor.medicalCenter === selectedCenter);
    setFilteredDoctors(filtered);
    setStep(3);
    // Reset subsequent selections
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };
  // Handle doctor selection
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep(4);
    // Reset subsequent selections
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
    navigate('/dashboard/payment', {
      state: {
        doctor: selectedDoctor,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        medicalCenter: medicalCenters.find(center => center.id === selectedMedicalCenter)?.name
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
  // Go back to previous step
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 p-6 text-white">
        <h1 className="text-xl font-semibold">Channel a Doctor</h1>
        <p className="text-blue-100">Book an appointment with a specialist</p>
      </div>
      {/* Progress Steps */}
      <div className="px-6 pt-6">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map(stepNum => <Fragment key={stepNum}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${stepNum <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} ${stepNum < step ? 'cursor-pointer' : ''}`} onClick={() => stepNum < step && setStep(stepNum)}>
                {stepNum < step ? <CheckCircleIcon className="h-5 w-5" /> : <span className="text-sm">{stepNum}</span>}
              </div>
              {stepNum < 5 && <div className={`flex-1 h-1 mx-2 ${stepNum < step ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
            </Fragment>)}
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
        {step === 1 && <div>
            <h2 className="text-lg font-semibold mb-4">
              Select Specialization
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specializations.map(spec => <div key={spec.id} onClick={() => handleSpecializationSelect(spec.id)} className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${selectedSpecialization === spec.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <h3 className="font-medium">{spec.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {spec.description}
                  </p>
                </div>)}
            </div>
          </div>}
        {/* Step 2: Select Medical Center */}
        {step === 2 && <div>
            <button onClick={goBack} className="text-blue-600 mb-4 flex items-center text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Specializations
            </button>
            <h2 className="text-lg font-semibold mb-4">
              Select Medical Center
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Use Current Location
              </label>
              <button className="flex items-center px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50">
                <MapPinIcon className="h-4 w-4 mr-2" />
                Find Nearest Centers
              </button>
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Available Medical Centers
              </h3>
              <div className="space-y-3">
                {medicalCenters.map(center => <div key={center.id} onClick={() => handleMedicalCenterSelect(center.id)} className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${selectedMedicalCenter === center.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <h4 className="font-medium">{center.name}</h4>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-gray-500">{center.address}</p>
                      <p className="text-sm text-blue-600">{center.distance}</p>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>}
        {/* Step 3: Select Doctor */}
        {step === 3 && <div>
            <button onClick={goBack} className="text-blue-600 mb-4 flex items-center text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Medical Centers
            </button>
            <h2 className="text-lg font-semibold mb-4">Select Doctor</h2>
            {filteredDoctors.length > 0 ? <div className="space-y-4">
                {filteredDoctors.map(doctor => <div key={doctor.id} onClick={() => handleDoctorSelect(doctor)} className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${selectedDoctor?.id === doctor.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
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
                  </div>)}
              </div> : <div className="text-center py-8">
                <UserIcon className="h-10 w-10 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No doctors available
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try selecting a different specialization or medical center.
                </p>
              </div>}
          </div>}
        {/* Step 4: Select Date */}
        {step === 4 && selectedDoctor && <div>
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
              <DatePicker selected={selectedDate} onChange={(date: Date) => handleDateSelect(date)} includeDates={selectedDoctor.availableDates} minDate={new Date()} inline className="border rounded-md" />
            </div>
            <div className="text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Available dates are highlighted on the calendar
            </div>
          </div>}
        {/* Step 5: Select Time Slot */}
        {step === 5 && selectedDoctor && selectedDate && <div>
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
              {selectedDoctor.availableSlots.map(slot => <button key={slot} onClick={() => handleTimeSlotSelect(slot)} className={`py-2 px-4 border rounded-md text-center ${selectedTimeSlot === slot ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-blue-50'}`}>
                  {slot}
                </button>)}
            </div>
            <button onClick={handleProceedToPayment} disabled={!selectedTimeSlot} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Proceed to Payment
            </button>
          </div>}
      </div>
    </div>;
};
export default DoctorChanneling;
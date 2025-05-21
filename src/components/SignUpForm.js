import React, { useState } from 'react';
import { Calendar, MapPin, TrendingUp, MessageSquare, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../firebase';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        affiliationType: '',
        netId: '',
        graduationYear: '',
        program: '',
        attendance: '',
        questions: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Check if we should show Cornell-specific fields based on affiliation
    const showCornellFields = () => {
        return ['Current Class', 'Incoming Class', 'Alumni'].includes(formData.affiliationType);
    };

    // Check if we should show graduation year (only for Alumni)
    const showGraduationYear = () => {
        return formData.affiliationType === 'Alumni';
    };

    // Check if we should show program field (for Current and Incoming students)
    const showProgram = () => {
        return ['Current Class', 'Incoming Class'].includes(formData.affiliationType);
    };

    const handleSubmit = async () => {
        // Validate form data
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.affiliationType || !formData.attendance) {
            setError('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Validate Cornell-specific fields
        if (showCornellFields() && !formData.netId) {
            setError('Please provide your Cornell NetID');
            return;
        }

        if (showGraduationYear() && !formData.graduationYear) {
            setError('Please provide your graduation year');
            return;
        }

        if (showProgram() && !formData.program) {
            setError('Please provide your program');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Add timestamp to the data
            const submissionData = {
                ...formData,
                timestamp: new Date().toISOString()
            };

            // Save data to Firestore
            const docRef = await addDoc(collection(db, "registrations"), submissionData);
            console.log("Registration saved with ID:", docRef.id);

            // Show success confirmation
            setSubmitted(true);
        } catch (err) {
            console.error('Registration error:', err);
            setError(`Registration failed: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
                <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl border border-gray-100">
                    <div className="text-center mb-8">
                        <img
                            src="/CornellLogo copy.png"
                            alt="Cornell University Logo"
                            className="h-16 mx-auto mb-4"
                        />
                        <h1 className="text-3xl font-bold text-red-700">Thank You for Registering!</h1>
                    </div>

                    <div className="text-center mb-8">
                        <svg className="w-full h-20 mb-6" viewBox="0 0 600 100">
                            <path
                                d="M0,50 C150,20 300,80 600,50"
                                fill="none"
                                stroke="#B31B1B"
                                strokeWidth="2"
                            />
                        </svg>
                        <p className="text-lg">Your registration for John Southcott's guest speaker event has been confirmed.</p>
                        <p className="mt-2">We look forward to seeing you on June 4, 2025 at 7:30 PM EST via Zoom.</p>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => setSubmitted(false)}
                            className="bg-red-700 text-white py-2 px-6 rounded-md hover:bg-red-800 transition shadow-md"
                        >
                            Register Another Person
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header/Navbar */}
            <header className="bg-white shadow-lg py-4 sticky top-0 z-10">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <img
                        src="/CornellLogo copy.png"
                        alt="Cornell University Logo"
                        className="h-12"
                    />
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="text-red-700 hover:text-red-800 font-medium">Home</Link>
                        <Link to="/team" className="flex items-center text-red-700 hover:text-red-800">
                            <Users size={18} className="mr-1" />
                            <span className="font-medium">Meet The Team</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Banner */}
            <div className="bg-gradient-to-r from-red-900 to-red-700 text-white py-12">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-4">MSBA Quantitative Finance Group</h2>
                    <p className="text-xl text-gray-200 mb-6">Guest Speaker Event Registration</p>
                    <div className="w-32 h-1 bg-white rounded-full mx-auto"></div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Registration Form */}
                    <div className="lg:w-3/5">
                        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Event Registration</h2>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium" htmlFor="firstName">
                                            First Name*
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium" htmlFor="lastName">
                                            Last Name*
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2 font-medium" htmlFor="email">
                                        Email Address*
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2 font-medium" htmlFor="affiliationType">
                                        Affiliation with Cornell*
                                    </label>
                                    <select
                                        id="affiliationType"
                                        name="affiliationType"
                                        value={formData.affiliationType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                                        required
                                    >
                                        <option value="">Please select</option>
                                        <option value="Current Class">Current Class</option>
                                        <option value="Incoming Class">Incoming Class</option>
                                        <option value="Alumni">Alumni</option>
                                        <option value="Outside of Cornell">Outside of Cornell</option>
                                    </select>
                                </div>

                                {/* Cornell-specific fields shown only when relevant */}
                                {showCornellFields() && (
                                    <div className="mb-6">
                                        <label className="block text-gray-700 mb-2 font-medium" htmlFor="netId">
                                            Cornell NetID*
                                        </label>
                                        <input
                                            type="text"
                                            id="netId"
                                            name="netId"
                                            value={formData.netId}
                                            onChange={handleChange}
                                            placeholder="e.g., am3299"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                )}

                                {/* Show graduation year only for Alumni */}
                                {showGraduationYear() && (
                                    <div className="mb-6">
                                        <label className="block text-gray-700 mb-2 font-medium" htmlFor="graduationYear">
                                            Graduation Year*
                                        </label>
                                        <input
                                            type="number"
                                            id="graduationYear"
                                            name="graduationYear"
                                            value={formData.graduationYear}
                                            onChange={handleChange}
                                            min="1900"
                                            max="2025"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                )}

                                {/* Show program field only for Current and Incoming students */}
                                {showProgram() && (
                                    <div className="mb-6">
                                        <label className="block text-gray-700 mb-2 font-medium" htmlFor="program">
                                            Program*
                                        </label>
                                        <input
                                            type="text"
                                            id="program"
                                            name="program"
                                            value={formData.program}
                                            onChange={handleChange}
                                            placeholder="e.g., MSBA, MBA, etc."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2 font-medium" htmlFor="attendance">
                                        Will you attend the event?*
                                    </label>
                                    <select
                                        id="attendance"
                                        name="attendance"
                                        value={formData.attendance}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                                        required
                                    >
                                        <option value="">Please select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="Maybe">Maybe</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-gray-700 mb-2 font-medium" htmlFor="questions">
                                        Have questions or topics you'd like John to cover?
                                    </label>
                                    <textarea
                                        id="questions"
                                        name="questions"
                                        value={formData.questions}
                                        onChange={handleChange}
                                        placeholder="e.g., options strategies, market dynamics, cryptocurrency trading, etc."
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    ></textarea>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className={`bg-red-700 text-white py-3 px-8 rounded-md hover:bg-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? 'Processing...' : 'Register for Event'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Speaker Information */}
                    <div className="lg:w-2/5">
                        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-100 sticky top-24">
                            <div className="flex flex-col">
                                <div className="mb-6 flex justify-center">
                                    <img
                                        src="/JohnSouthcott.png"
                                        alt="John Southcott"
                                        className="rounded-lg h-56 object-cover shadow-md"
                                    />
                                </div>

                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">John Southcott</h2>
                                    <p className="text-red-700 font-medium">Chief Operating Officer & Chief Financial Officer</p>
                                    <p className="text-gray-600">Urim Capital</p>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center">
                                        <Calendar className="text-red-700 mr-3" size={20} />
                                        <div>
                                            <p className="font-semibold">Date & Time:</p>
                                            <p>June 4, 2025 | 7:30-8:30 PM EST</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <MapPin className="text-red-700 mr-3" size={20} />
                                        <div>
                                            <p className="font-semibold">Location:</p>
                                            <p>Zoom (link will be provided after registration)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <TrendingUp className="text-red-700 mr-3" size={20} />
                                        <div>
                                            <p className="font-semibold">Discussion Topic:</p>
                                            <p>Finance and Trading Strategies</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <MessageSquare className="text-red-700 mr-3 mt-1" size={20} />
                                        <p className="text-gray-700">
                                            John will share insights on navigating the evolving landscape of finance and investment,
                                            focusing on strategies, innovations, and practical approaches to making informed decisions
                                            on derivatives trading.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h3 className="font-bold text-lg mb-3">Career Highlights:</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                        <li>Over a decade at Deloitte, with leadership roles in innovation and audit</li>
                                        <li>Spearheaded Deloitte's Strategic Process and Transformation group</li>
                                        <li>Led IPO efforts and audits for multibillion-dollar companies</li>
                                        <li>Board member/advisor for firms including RTX Fintech & Research, Ketsen Networks, and WeLink</li>
                                        <li>Board of Managers for Skypark Airport</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 mt-8">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="font-medium">Hosted by Cornell Quantitative Finance Group</p>
                            <p className="mt-1 text-sm text-gray-400">© 2025 Cornell University</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SignUpForm;
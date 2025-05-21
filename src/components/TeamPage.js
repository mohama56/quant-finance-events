import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Home } from 'lucide-react';

const TeamPage = () => {
    // Team members data
    const teamMembers = [
        {
            name: "Luke Watts",
            title: "Managing Director and Treasurer",
            description: "Oversees all financial operations and manages the group's portfolio performance strategies while ensuring regulatory compliance and fiduciary responsibility."
        },
        {
            name: "Charlie Parkhurst",
            title: "Chief Investment Officer",
            description: "Develops and implements investment strategies across all asset classes, oversees risk management, and ensures alignment with the group's investment philosophy."
        },
        {
            name: "Garry Gill",
            title: "Head of Macroeconomic Trading",
            description: "Specializes in foreign exchange, commodities, and volatility trading based on macroeconomic trends and central bank policies."
        },
        {
            name: "Parth Mehta",
            title: "Head of Equities",
            description: "Leads equity research, identifies market opportunities, and develops stock valuation models to maximize portfolio returns."
        },
        {
            name: "Alamin Mohammed",
            title: "Head of Crypto and Digital Assets",
            description: "Analyzes blockchain technologies and digital asset markets to identify emerging opportunities while managing risk exposure in this evolving sector."
        },
        {
            name: "Sahil Patel",
            title: "Head of ETFs and Mutual Funds",
            description: "Researches and selects fund investments based on performance metrics, expense ratios, and alignment with portfolio allocation strategies."
        },
        {
            name: "Pareen Desai",
            title: "Head of Operations & External Relations",
            description: "Manages day-to-day operations, coordinates with external partners, and represents the group at industry events and networking opportunities."
        },
        {
            name: "James Calle",
            title: "Head of Futures Trading",
            description: "Develops futures trading strategies across commodities, indices, and currencies with a focus on hedging and leveraging market movements."
        },
        {
            name: "George Grecu",
            title: "Head of Options Trading",
            description: "Specializes in options strategies including covered calls, protective puts, and complex spreads to optimize risk-adjusted returns."
        }
    ];

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
                        <Link to="/" className="flex items-center text-red-700 hover:text-red-800">
                            <Home size={18} className="mr-1" />
                            <span className="font-medium">Home</span>
                        </Link>
                        <Link to="/team" className="text-red-700 hover:text-red-800 font-medium">Meet The Team</Link>
                    </div>
                </div>
            </header>

            {/* Banner */}
            <div className="bg-gradient-to-r from-red-900 to-red-700 text-white py-10">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-2">MSBA Quantitative Finance Group</h2>
                    <p className="text-xl text-gray-200 mb-4">Our Leadership Team</p>
                    <div className="w-32 h-1 bg-white rounded-full mx-auto"></div>
                </div>
            </div>

            {/* Team Members Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800">Meet Our Team</h2>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                            Our leadership team comprises talented individuals with diverse expertise in quantitative finance,
                            working together to drive innovation and excellence in investment strategies.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105">
                                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                                <h4 className="text-red-700 font-medium mb-3">{member.title}</h4>
                                <div className="w-12 h-1 bg-red-200 rounded-full mb-4"></div>
                                <p className="text-gray-600">{member.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Rocky Brito Card */}
                    <div className="col-span-full flex justify-center mt-12">
                        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105">
                            <h3 className="text-xl font-bold text-gray-800">Rocky Brito</h3>
                            <h4 className="text-red-700 font-medium mb-3">Chief Visionary</h4>
                            <div className="w-12 h-1 bg-red-200 rounded-full mb-4"></div>
                            <p className="text-gray-600">
                                Identifies long-term market trends and disruptive technologies to guide the group's strategic direction and investment thesis.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 mt-auto">
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

export default TeamPage;
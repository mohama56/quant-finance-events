// src/components/AdminPage.js
import React, { useState, useEffect } from 'react';
import { getRegistrations, exportToCSV } from '../api';

function AdminPage() {
    const [registrations, setRegistrations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getRegistrations();
                setRegistrations(data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleExportCSV = async () => {
        try {
            await exportToCSV();
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Registrations Admin</h1>

            <button
                onClick={handleExportCSV}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
            >
                Export to CSV
            </button>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                    <tr>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Affiliation</th>
                        <th className="border px-4 py-2">Program</th>
                        <th className="border px-4 py-2">Graduation Year</th>
                        <th className="border px-4 py-2">Timestamp</th>
                    </tr>
                    </thead>
                    <tbody>
                    {registrations.map((reg) => (
                        <tr key={reg.id}>
                            <td className="border px-4 py-2">{reg.firstName} {reg.lastName}</td>
                            <td className="border px-4 py-2">{reg.email}</td>
                            <td className="border px-4 py-2">{reg.affiliationType}</td>
                            <td className="border px-4 py-2">{reg.program || '-'}</td>
                            <td className="border px-4 py-2">{reg.graduationYear || '-'}</td>
                            <td className="border px-4 py-2">{new Date(reg.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {registrations.length === 0 && (
                <p className="text-center p-4">No registrations found.</p>
            )}
        </div>
    );
}

export default AdminPage;
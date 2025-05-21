// src/components/AdminPage.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from '../firebase';

function AdminPage() {
    const [registrations, setRegistrations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(db, "registrations"), orderBy("timestamp", "desc"));
                const querySnapshot = await getDocs(q);

                const data = [];
                querySnapshot.forEach((doc) => {
                    data.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

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
            if (registrations.length === 0) {
                throw new Error("No registrations to export");
            }

            // Get headers from first registration
            const headers = [
                'First Name',
                'Last Name',
                'Email',
                'Affiliation',
                'NetID',
                'Graduation Year',
                'Program',
                'Attendance',
                'Questions',
                'Timestamp'
            ];

            // Convert data to CSV rows
            const csvRows = [];
            csvRows.push(headers.join(','));

            registrations.forEach(reg => {
                const row = [
                    csvEscape(reg.firstName),
                    csvEscape(reg.lastName),
                    csvEscape(reg.email),
                    csvEscape(reg.affiliationType),
                    csvEscape(reg.netId || ''),
                    csvEscape(reg.graduationYear || ''),
                    csvEscape(reg.program || ''),
                    csvEscape(reg.attendance || ''),
                    csvEscape(reg.questions || ''),
                    csvEscape(reg.timestamp)
                ];
                csvRows.push(row.join(','));
            });

            // Create a CSV file and download it
            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'registrations.csv');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError(err.message);
        }
    };

    // Helper function to escape CSV values
    function csvEscape(value) {
        if (value === null || value === undefined) {
            return '';
        }

        value = String(value);

        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            value = value.replace(/"/g, '""');
            return `"${value}"`;
        }

        return value;
    }

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
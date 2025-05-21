// src/api.js
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

// Add registration to Firestore
export const registerAttendee = async (formData) => {
    try {
        const registrationData = {
            ...formData,
            timestamp: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, "registrations"), registrationData);
        console.log("Registration saved with ID:", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error registering attendee:", error);
        throw error;
    }
};

// Get all registrations (for admin purposes)
export const getRegistrations = async () => {
    try {
        const q = query(collection(db, "registrations"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        const registrations = [];
        querySnapshot.forEach((doc) => {
            registrations.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return registrations;
    } catch (error) {
        console.error("Error fetching registrations:", error);
        throw error;
    }
};

// Export to CSV (client-side conversion)
export const exportToCSV = async () => {
    const registrations = await getRegistrations();

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
};

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
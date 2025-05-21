const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// Create a temp directory for our files
const tempDir = path.join(os.tmpdir(), 'quant-finance-data');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}
const registrationsFile = path.join(tempDir, 'registrations.csv');

// Initialize CSV file if it doesn't exist
function initializeCSVFile() {
    try {
        if (!fs.existsSync(registrationsFile)) {
            console.log('Creating new CSV file with headers');
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
            ].join(',');

            fs.writeFileSync(registrationsFile, headers + '\n');
            console.log('CSV file created with headers');
        }
    } catch (error) {
        console.error('Error initializing CSV file:', error);
    }
}

// Initialize CSV file on cold start
initializeCSVFile();

// Helper function to escape CSV values
function escapeCSV(value) {
    if (value === null || value === undefined) {
        return '';
    }

    value = String(value);

    // If the value contains a comma, quote, or newline, wrap it in quotes
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = value.replace(/"/g, '""');
        return `"${value}"`;
    }

    return value;
}

// Test route
app.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running properly' });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running properly',
        timestamp: new Date().toISOString()
    });
});

// Register route - append to CSV
app.post('/register', (req, res) => {
    try {
        console.log('Received registration data:', req.body);
        const formData = { ...req.body };

        // Add timestamp
        formData.timestamp = new Date().toISOString();

        // Validate required fields
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.affiliationType) {
            console.error('Missing required fields');
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Create CSV row
        const csvRow = [
            escapeCSV(formData.firstName),
            escapeCSV(formData.lastName),
            escapeCSV(formData.email),
            escapeCSV(formData.affiliationType),
            escapeCSV(formData.netId || ''),
            escapeCSV(formData.graduationYear || ''),
            escapeCSV(formData.program || ''),
            escapeCSV(formData.attendance || ''),
            escapeCSV(formData.questions || ''),
            escapeCSV(formData.timestamp)
        ].join(',');

        // Make sure the directory exists
        if (!fs.existsSync(path.dirname(registrationsFile))) {
            fs.mkdirSync(path.dirname(registrationsFile), { recursive: true });
        }

        // If file doesn't exist, create with headers
        if (!fs.existsSync(registrationsFile)) {
            initializeCSVFile();
        }

        // Append to CSV file
        fs.appendFileSync(registrationsFile, csvRow + '\n');
        console.log('Registration saved to CSV file');

        res.status(200).json({ success: true, message: 'Registration saved successfully' });
    } catch (error) {
        console.error('Error saving registration:', error);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
});

// Download CSV file
app.get('/download', (req, res) => {
    try {
        if (fs.existsSync(registrationsFile)) {
            const data = fs.readFileSync(registrationsFile, 'utf8');
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=registrations.csv');
            res.send(data);
        } else {
            res.status(404).json({ success: false, message: 'Registrations file not found' });
        }
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading file: ' + error.message
        });
    }
});

// Reset CSV file
app.get('/reset', (req, res) => {
    try {
        console.log('Resetting CSV file');
        if (fs.existsSync(registrationsFile)) {
            fs.unlinkSync(registrationsFile);
        }

        initializeCSVFile();

        res.json({
            success: true,
            message: 'Registrations file reset successfully',
            path: registrationsFile
        });
    } catch (error) {
        console.error('Error resetting file:', error);
        res.status(500).json({ success: false, message: 'Failed to reset file: ' + error.message });
    }
});

// Check CSV file status
app.get('/check', (req, res) => {
    try {
        const fileExists = fs.existsSync(registrationsFile);
        let rowCount = 0;
        let firstRow = '';

        if (fileExists) {
            const content = fs.readFileSync(registrationsFile, 'utf8');
            const lines = content.trim().split('\n');
            rowCount = lines.length - 1;
            firstRow = lines[0];
        }

        res.json({
            success: true,
            fileExists,
            filePath: registrationsFile,
            headers: firstRow,
            registrationsCount: rowCount
        });
    } catch (error) {
        console.error('Error checking file:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking file: ' + error.message
        });
    }
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
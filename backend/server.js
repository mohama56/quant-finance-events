// backend/server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- FIX: Add this at the very top to catch unhandled rejections and log startup crashes ---
process.on('unhandledRejection', err => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 10000;

console.log(`Server running on port ${PORT}`);

// Get __filename and __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// CORS configuration
app.use(cors({
    origin: [
        'https://msba-quantitative-finance.web.app',
        'https://msba-quantitative-finance.firebaseapp.com',
        'http://localhost:3000'  // For local development
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));

// Store CORS config for logging
app.set('cors', {
    origins: [
        'https://msba-quantitative-finance.web.app',
        'https://msba-quantitative-finance.firebaseapp.com',
        'http://localhost:3000'
    ]
});

app.use(bodyParser.json());

// *** IMPORTANT FIX: Use Render's persistent storage if available ***
const dataDir = process.env.RENDER_PERSISTENT_DIR
    ? path.join(process.env.RENDER_PERSISTENT_DIR, 'data')
    : path.join(__dirname, 'data');
const registrationsFile = path.join(dataDir, 'registrations.csv');

console.log('Data directory path:', dataDir);
console.log('Registrations file path:', registrationsFile);

// *** IMPROVED: More robust directory creation ***
try {
    if (!fs.existsSync(dataDir)) {
        console.log('Creating data directory');
        fs.mkdirSync(dataDir, { recursive: true });
    }
} catch (dirError) {
    console.error('Error creating data directory:', dirError);
}

// Initialize CSV file with headers if it doesn't exist
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

            // *** IMPROVED: Make sure the directory exists before writing ***
            if (!fs.existsSync(path.dirname(registrationsFile))) {
                fs.mkdirSync(path.dirname(registrationsFile), { recursive: true });
            }

            fs.writeFileSync(registrationsFile, headers + '\n');
            console.log('CSV file created with headers');
        }
    } catch (fileError) {
        console.error('Error initializing CSV file:', fileError);
        // Continue execution - we'll try to create the file again when a registration comes in
    }
}

// Initialize the CSV file on startup
initializeCSVFile();

// Test route
app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running properly' });
});

// Health check endpoint with server details
app.get('/api/health', (req, res) => {
    // Check if the data directory is accessible
    const directoryAccessible = fs.existsSync(dataDir);
    const fileAccessible = fs.existsSync(registrationsFile);

    res.json({
        status: 'ok',
        message: 'Server is running properly',
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        corsOrigins: app.get('cors'),
        dataDirectory: {
            path: dataDir,
            accessible: directoryAccessible
        },
        registrationsFile: {
            path: registrationsFile,
            accessible: fileAccessible
        }
    });
});

// Register route - simply append to CSV
app.post('/api/register', (req, res) => {
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

        // *** IMPROVED: Better error handling for file operations ***
        try {
            // Make sure the directory exists
            if (!fs.existsSync(path.dirname(registrationsFile))) {
                fs.mkdirSync(path.dirname(registrationsFile), { recursive: true });
            }

            // If the file doesn't exist, create it with headers
            if (!fs.existsSync(registrationsFile)) {
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
            }

            // Append to CSV file
            fs.appendFileSync(registrationsFile, csvRow + '\n');
            console.log('Registration saved to CSV file');

            // Verify the data was written
            try {
                const fileContent = fs.readFileSync(registrationsFile, 'utf8');
                const lines = fileContent.trim().split('\n');
                console.log(`CSV file now has ${lines.length} rows (including header)`);
            } catch (readErr) {
                console.error('Error reading file after write:', readErr);
                // Continue anyway - the write might have succeeded
            }
        } catch (writeErr) {
            console.error('Error writing to CSV file:', writeErr);
            // Try one more time
            try {
                fs.mkdirSync(path.dirname(registrationsFile), { recursive: true });
                fs.appendFileSync(registrationsFile, csvRow + '\n');
                console.log('Registration saved to CSV file after retry');
            } catch (retryErr) {
                console.error('Retry failed:', retryErr);
                throw new Error('Failed to save registration after retry');
            }
        }

        res.status(200).json({ success: true, message: 'Registration saved successfully' });
    } catch (error) {
        console.error('Error saving registration:', error);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
});

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

// Download CSV file
app.get('/api/download', (req, res) => {
    if (fs.existsSync(registrationsFile)) {
        res.download(registrationsFile, 'registrations.csv');
    } else {
        res.status(404).json({ success: false, message: 'Registrations file not found' });
    }
});

// Reset CSV file
app.get('/api/reset', (req, res) => {
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
app.get('/api/check', (req, res) => {
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

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Server timestamp: ${new Date().toISOString()}`);
    console.log(`CORS origins configured for: ${JSON.stringify(app.get('cors'))}`);
});
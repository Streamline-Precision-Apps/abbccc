
"use client";  // Ensure this is a client component

import React from 'react';
import "../app/styles.css";  // Import custom styles
import QRScanner from '../components/QRScanner';  // Import the scanner component

const Home = () => {
    return (
        <div className="container">
            <h1 className="title">QR Code Scanner</h1>

            <QRScanner />  // Use the scanner component here
        </div>
    );
};

export default Home;
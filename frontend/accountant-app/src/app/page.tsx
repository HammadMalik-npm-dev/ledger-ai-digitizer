'use client'
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function Home() {
  const [status, setStatus] = useState('Idle');
  const [csvData, setCsvData] = useState(''); // Renamed for clarity
  const [debugText, setDebugText] = useState(''); // Optional: to see what OCR saw

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setStatus('Processing... (AI is reading the handwritten text)');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send to Python Backend
      const response = await axios.post('http://localhost:8000/process-page', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // FIX 1: Match the specific keys from your Python return statement
      setCsvData(response.data.csv_data); 
      setDebugText(response.data.raw_text_found);
      
      setStatus('Done!');
    } catch (error) {
      console.error(error);
      setStatus('Error processing image. Is the Python backend running?');
    }
  };

  // FIX 2: Actual Download Functionality
  const downloadCSV = () => {
    // Create a hidden link to trigger the download
    const element = document.createElement("a");
    const file = new Blob([csvData], {type: 'text/csv'});
    element.href = URL.createObjectURL(file);
    element.download = "ledger_data.csv";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-10">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Accountant Ledger Digitizer</h1>
      
      {/* Drop Zone */}
      <div {...getRootProps()} className="border-4 border-dashed border-blue-200 p-20 rounded-xl bg-white cursor-pointer hover:bg-blue-50 transition">
        <input {...getInputProps()} />
        <p className="text-gray-500">Drag & drop the notebook page here</p>
      </div>

      {/* Status */}
      <p className={`mt-4 font-semibold ${status.includes('Error') ? 'text-red-600' : 'text-blue-600'}`}>
        {status}
      </p>

      {/* Results */}
      {csvData && (
        <div className="mt-8 w-full max-w-2xl animate-fade-in">
          
          <h2 className="text-xl font-bold mb-2">Clean CSV Output:</h2>
          <textarea 
            className="w-full bg-white p-4 rounded shadow h-48 text-sm border font-mono"
            value={csvData}
            readOnly
          />

          <div className="flex gap-4 mt-4">
            <button 
                onClick={downloadCSV}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold shadow-lg"
            >
              Download CSV File
            </button>
          </div>

          {/* Optional Debug View */}
          <details className="mt-6 text-gray-500">
            <summary className="cursor-pointer">View Raw OCR Data (Debug)</summary>
            <p className="mt-2 text-xs border p-2 bg-gray-100 rounded">
                {debugText}
            </p>
          </details>

        </div>
      )}
    </main>
  );
}

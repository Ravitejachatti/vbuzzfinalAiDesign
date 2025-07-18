import  { useState } from 'react';
import JobManager from './JobManager';
import StudentsAppliedForJob from './StudentsAppliedForJob';

function CollegeJob() {
    const [activeTab, setActiveTab] = useState('add'); // State to track which tab is active

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Tab Navigation */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <button
                    onClick={() => setActiveTab('edit')}
                    style={{
                        padding: '5px 5px',
                        backgroundColor: activeTab === 'edit' ? '#007BFF' : '#f0f0f0',
                        color: activeTab === 'edit' ? '#fff' : '#000',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '5px'
                    }}
                >
                   JobManager
                </button>
                <button
                    onClick={() => setActiveTab('add')}
                    style={{
                        padding: '5px 5px',
                        backgroundColor: activeTab === 'add' ? '#007BFF' : '#f0f0f0',
                        color: activeTab === 'add' ? '#fff' : '#000',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '5px'
                    }}
                >
                    StudentsAppliedForJob
                </button>
            </div>

            {/* Conditional Rendering */}
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px' }}>
                {activeTab === 'add' && <JobManager />}
                {activeTab === 'edit' && <StudentsAppliedForJob />}
            </div>
        </div>
    );
}

export default CollegeJob;



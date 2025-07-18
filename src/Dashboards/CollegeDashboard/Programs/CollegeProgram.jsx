import React, { useState } from 'react';
import AddProgram from './CollegeAddProgram';
import ViewPrograms from './CollegeViewPrograms';



function CollegeProgram() {
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
                   View Program
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
                    Add Programs
                </button>
            </div>

            {/* Conditional Rendering */}
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px' }}>
                {activeTab === 'add' && <AddProgram />}
                {activeTab === 'edit' && <ViewPrograms />}
            </div>
        </div>
    );
}

export default CollegeProgram;

import React from 'react'

function Settings() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Settings</h1>
            <p>This page is for the settings of the college dashboard.</p>
            <div className="bg-white p-4 rounded shadow-md">
                <h3 className="text-xl font-semibold mb-2">Account Settings</h3>
                <p>Manage your account settings here.</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md mt-4">
                <h3 className="text-xl font-semibold mb-2">Notification Settings</h3>
                <p>Manage your notification preferences here.</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md mt-4">
                <h3 className="text-xl font-semibold mb-2">Privacy Settings</h3>
                <p>Manage your privacy settings here.</p>                   
        </div>
        </div>
    )                       
}

export default Settings;

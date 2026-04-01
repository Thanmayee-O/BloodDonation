import React, { useState } from 'react'

function Login({ onLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        role: ''
    })

    const [error, setError] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        setError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            setError('Please enter your name')
            return
        }

        if (!formData.role) {
            setError('Please select a role')
            return
        }

        // Call parent function to update App state with login info
        onLogin(formData.name, formData.role)
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-red-50 px-5 py-10">
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 w-full max-w-md border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">🩸 LifeDrop</h1>
                    <p className="text-gray-500 text-sm sm:text-base">Sign in to Help Save Lives</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block mb-2 text-gray-800 font-semibold text-sm">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-600 focus:ring focus:ring-red-100 transition-all placeholder-gray-400"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block mb-2 text-gray-800 font-semibold text-sm">Select Your Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all bg-white"
                        >
                            <option value="">-- Choose a role --</option>
                            <option value="Donor">🩸 Donor (Register to donate blood)</option>
                            <option value="Receiver">🏥 Receiver (Find blood donors)</option>
                        </select>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm border border-red-200 flex items-center gap-2">
                            ⚠️ {error}
                        </div>
                    )}

                    <button type="submit" className="w-full py-3 bg-red-600 text-white rounded-lg text-base font-bold transition-all duration-300 hover:bg-red-700 hover:shadow-md active:scale-95">
                        Continue
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t-2 border-gray-100">
                    <h3 className="text-gray-800 text-base m-0 mb-4 text-center">How it works:</h3>
                    <ul className="list-none p-0 m-0">
                        <li className="text-gray-600 text-sm mb-2"><strong>Donors:</strong> Register your details to help those in need</li>
                        <li className="text-gray-600 text-sm"><strong>Receivers:</strong> Find nearby blood donors matching your blood group</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Login

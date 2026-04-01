import React, { useState } from 'react'
import { getCurrentLocation } from '../utils/geolocation'

function Registration({ onRegistered, setCurrentPage }) {
    const url = import.meta.env.VITE_API_URL
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        bloodGroup: '',
        address: '',
        area: '',
        pincode: '',
        email: '',
        phone: '',
        latitude: null,
        longitude: null
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleGetLocation = async () => {
        try {
            setLoading(true)
            setMessage({ type: '', text: '' })
            const location = await getCurrentLocation()
            setFormData({
                ...formData,
                latitude: location.latitude,
                longitude: location.longitude
            })
            setMessage({ type: 'success', text: 'Location captured successfully!' })
        } catch (error) {
            setMessage({ type: 'error', text: error })
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.name || !formData.age || !formData.bloodGroup || !formData.address || !formData.area || !formData.pincode) {
            setMessage({ type: 'error', text: 'Please fill all required fields' })
            return
        }

        if (formData.latitude === null || formData.longitude === null) {
            setMessage({ type: 'error', text: 'Please get your location first' })
            return
        }

        try {
            setLoading(true)
            setMessage({ type: '', text: '' })

            const response = await fetch(`${url}/api/donor/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()
            console.log('Registration response:', result)

            if (result.success) {
                setMessage({ type: 'success', text: 'Registration successful! You will be redirected.' })
                setFormData({
                    name: '',
                    age: '',
                    bloodGroup: '',
                    address: '',
                    area: '',
                    pincode: '',
                    email: '',
                    phone: '',
                    latitude: null,
                    longitude: null
                })

                setTimeout(() => {
                    onRegistered()
                    setCurrentPage('search')
                }, 2000)
            } else {
                setMessage({ type: 'error', text: result.message })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error registering donor: ' + error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-7 py-7 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-red-600 mb-6 text-center font-bold text-3xl">Register as Donor</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-800">Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="w-full px-3 py-3 border border-gray-300 rounded text-sm transition-all duration-300 focus:outline-none focus:border-red-600 focus:ring focus:ring-red-200"
                    />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-800">Age *</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="Enter your age"
                        min="18"
                        max="65"
                        className="w-full px-3 py-3 border border-gray-300 rounded text-sm transition-all duration-300 focus:outline-none focus:border-red-600 focus:ring focus:ring-red-200"
                    />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-800">Blood Group *</label>
                    <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded text-sm transition-all duration-300 focus:outline-none focus:border-red-600 focus:ring focus:ring-red-200"
                    >
                        <option value="">Select Blood Group</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                    </select>
                </div>

                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-800">Address *</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                        className="w-full px-3 py-3 border border-gray-300 rounded text-sm transition-all duration-300 focus:outline-none focus:border-red-600 focus:ring focus:ring-red-200"
                    />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-800">Area *</label>
                    <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="Enter your area"
                        className="w-full px-3 py-3 border border-gray-300 rounded text-sm transition-all duration-300 focus:outline-none focus:border-red-600 focus:ring focus:ring-red-200"
                    />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-800">Pincode *</label>
                    <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="Enter your pincode"
                        className="w-full px-3 py-3 border border-gray-300 rounded text-sm transition-all duration-300 focus:outline-none focus:border-red-600 focus:ring focus:ring-red-200"
                    />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-800">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full px-3 py-3 border border-gray-300 rounded text-sm transition-all duration-300 focus:outline-none focus:border-red-600 focus:ring focus:ring-red-200"
                    />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-800">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="w-full px-3 py-3 border border-gray-300 rounded text-sm transition-all duration-300 focus:outline-none focus:border-red-600 focus:ring focus:ring-red-200"
                    />
                </div>

                <div className="mb-5 bg-white px-4 py-4 rounded border-l-4 border-red-600">
                    <label className="block mb-2 font-semibold text-gray-800">Location</label>
                    {formData.latitude && formData.longitude ? (
                        <p className="text-green-600 font-semibold m-0">
                            ✓ Location captured: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                        </p>
                    ) : (
                        <p className="m-0 text-gray-600 text-sm">Click 'Get My Location' to capture your coordinates</p>
                    )}
                </div>

                {message.text && (
                    <div className={`px-4 py-3 rounded-lg mb-6 font-medium text-sm flex items-center gap-2 border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                        {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={loading}
                        className="flex-1 px-5 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg text-base font-bold transition-all duration-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                    >
                        {loading ? 'Getting Location...' : 'Get My Location'}
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-5 py-3 bg-red-600 text-white rounded-lg text-base font-bold transition-all duration-300 hover:bg-red-700 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Registration

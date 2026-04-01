import React, { useState } from 'react'
import { getCurrentLocation } from '../utils/geolocation'
import { calculateDistance } from '../utils/distance'

function Search({ setCurrentPage }) {
    const url = import.meta.env.VITE_API_URL
    const [searchData, setSearchData] = useState({
        bloodGroup: '',
        latitude: null,
        longitude: null
    })

    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [searched, setSearched] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setSearchData({ ...searchData, [name]: value })
    }

    const handleGetLocation = async () => {
        try {
            setLoading(true)
            setMessage({ type: '', text: '' })
            const location = await getCurrentLocation()
            setSearchData({
                ...searchData,
                latitude: location.latitude,
                longitude: location.longitude
            })
            setMessage({ type: 'success', text: 'Your location captured!' })
        } catch (error) {
            setMessage({ type: 'error', text: error })
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()

        if (!searchData.bloodGroup) {
            setMessage({ type: 'error', text: 'Please select a blood group' })
            return
        }

        if (searchData.latitude === null || searchData.longitude === null) {
            setMessage({ type: 'error', text: 'Please capture your location first' })
            return
        }

        try {
            setLoading(true)
            setMessage({ type: '', text: '' })
            setSearched(true)

            const query = new URLSearchParams({
                bloodGroup: searchData.bloodGroup,
                latitude: searchData.latitude,
                longitude: searchData.longitude,
                radius: 5
            })

            const response = await fetch(`${url}/api/donor/search?${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const result = await response.json()

            if (result.success) {
                setResults(result.data)
                if (result.count === 0) {
                    setMessage({ type: 'info', text: 'No donors found in your area for this blood group' })
                } else {
                    setMessage({ type: 'success', text: `Found ${result.count} donor(s)` })
                }
            } else {
                setMessage({ type: 'error', text: result.message })
                setResults([])
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error searching donors: ' + error.message })
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-7 py-7 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-red-600 mb-6 text-center font-bold text-3xl">Find Blood Donors</h2>

            <form onSubmit={handleSearch}>
                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-800">Blood Group *</label>
                    <select
                        name="bloodGroup"
                        value={searchData.bloodGroup}
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

                <div className="mb-5 bg-white px-4 py-4 rounded border-l-4 border-red-600">
                    <label className="block mb-2 font-semibold text-gray-800">Your Location</label>
                    {searchData.latitude && searchData.longitude ? (
                        <p className="text-green-600 font-semibold m-0">
                            ✓ Location: {searchData.latitude.toFixed(4)}, {searchData.longitude.toFixed(4)}
                        </p>
                    ) : (
                        <p className="m-0 text-gray-600 text-sm">Click 'Get My Location' to capture your coordinates</p>
                    )}
                </div>

                {message.text && (
                    <div className={`px-4 py-3 rounded-lg mb-6 font-medium text-sm flex items-center gap-2 border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : message.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                        {message.type === 'success' ? '✅' : message.type === 'error' ? '⚠️' : 'ℹ️'} {message.text}
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
                        {loading ? 'Searching...' : 'Search Donors'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setCurrentPage('register')}
                        className="flex-1 px-5 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-base font-bold transition-all duration-300 hover:bg-red-100 hover:shadow-sm"
                    >
                        Register as Donor
                    </button>
                </div>
            </form>

            {searched && results.length > 0 && (
                <div className="mt-7">
                    <h3 className="text-gray-800 mt-7 mb-5 border-b-2 border-red-600 pb-2">Available Donors ({results.length})</h3>
                    <div className="grid gap-5">
                        {results.map((donor) => (
                            <div key={donor._id} className="bg-white border border-red-100 rounded-xl p-6 transition-all duration-300 shadow-sm hover:shadow-lg hover:border-red-400">
                                <div>
                                    <h4 className="text-red-600 m-0 mb-4 text-lg">{donor.name}</h4>
                                    <p className="my-2 text-gray-700 text-sm"><strong>Age:</strong> {donor.age}</p>
                                    <p className="my-2 text-gray-700 text-sm"><strong>Blood Group:</strong> <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold text-xs inline-block">{donor.bloodGroup}</span></p>
                                    <p className="my-2 text-gray-700 text-sm"><strong>Area:</strong> {donor.area}</p>
                                    <p className="my-2 text-gray-700 text-sm"><strong>Pincode:</strong> {donor.pincode}</p>
                                    <p className="my-2 text-gray-700 text-sm"><strong>Address:</strong> {donor.address}</p>
                                    {donor.distance !== undefined && (
                                        <p className="my-2 text-gray-700 text-sm"><strong>Distance:</strong> <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold text-xs inline-block">{donor.distance} km</span></p>
                                    )}
                                    {donor.phone && (
                                        <p className="my-2 text-gray-700 text-sm"><strong>Phone:</strong> {donor.phone}</p>
                                    )}
                                    {donor.email && (
                                        <p className="my-2 text-gray-700 text-sm"><strong>Email:</strong> {donor.email}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {searched && results.length === 0 && !message.text && (
                <div className="mt-7 text-center">
                    <p className="text-gray-600">No donors found matching your criteria.</p>
                </div>
            )}
        </div>
    )
}

export default Search

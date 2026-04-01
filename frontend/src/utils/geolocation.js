// Geolocation utility to get user's current location
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('Geolocation is not supported by this browser.');
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                (error) => {
                    let message = '';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = 'Permission denied. Please enable location access.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = 'Location information is unavailable.';
                            break;
                        case error.TIMEOUT:
                            message = 'Location request timed out.';
                            break;
                        default:
                            message = 'An unknown error occurred.';
                    }
                    reject(message);
                }
            );
        }
    });
};

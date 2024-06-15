import { useState, useEffect } from "react";

const useCurrentLocation = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const handleSuccess = (position: any) => {
      console.log(position.coords)
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const handleError = (error: any) => {
      console.log(error)
      setError(error.message);
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError);

    // Cleanup function to clear the watcher
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error };
};

export default useCurrentLocation;

export interface UserLocation {
  latitude: number
  longitude: number
}

export async function getLocation(): Promise<UserLocation> {
  if (!("geolocation" in navigator)) {
    throw new Error("Geolocation is not supported")
  }

  return new Promise<UserLocation>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },

      (error: GeolocationPositionError) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Location permission denied"))
            break

          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information unavailable"))
            break

          case error.TIMEOUT:
            reject(new Error("Location request timed out"))
            break

          default:
            reject(new Error("Failed to get location"))
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  })
}
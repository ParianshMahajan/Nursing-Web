const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371.0; // Earth radius in kilometers

    // Convert latitude and longitude from degrees to radians
    const [radLat1, radLon1, radLat2, radLon2] = [lat1, lon1, lat2, lon2].map((coord) => (coord * Math.PI) / 180);

    // Differences in coordinates
    const dlat = radLat2 - radLat1;
    const dlon = radLon2 - radLon1;

    // Haversine formula
    const a = Math.sin(dlat / 2) ** 2 + Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in kilometers
    const distance = R * c;

    return distance;
};



console.log(calculateHaversineDistance(30.7333,76.7794,30.3398,76.3869));
import React, { useState, useEffect, useCallback } from 'react';
import { View, Dimensions } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import Svg, { Circle as SvgCircle, Defs, Mask, Rect } from 'react-native-svg';
import throttle from 'lodash.throttle';
import styles from './styles';

interface VisitedRegion {
  latitude: number;
  longitude: number;
}

const App: React.FC = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 43.65107,   // Toronto latitude
    longitude: -79.347015, // Toronto longitude
    latitudeDelta: 0.01,   // Zoomed-in latitude delta
    longitudeDelta: 0.01,  // Zoomed-in longitude delta
  });

  const [currentLocation, setCurrentLocation] = useState<VisitedRegion | null>(null);
  const [visitedRegions, setVisitedRegions] = useState<VisitedRegion[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      console.log('Initial location:', { latitude, longitude });
      setRegion((prevRegion) => ({ ...prevRegion, latitude, longitude }));
      setCurrentLocation({ latitude, longitude });
      setVisitedRegions([{ latitude, longitude }]);
    })();
  }, []);

  useEffect(() => {
    const startLocationUpdates = async () => {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update every meter
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          console.log('Updated location:', { latitude, longitude });
          setCurrentLocation({ latitude, longitude });
          setVisitedRegions((prevRegions) => {
            const isNewRegion = !prevRegions.some(
              (region) => region.latitude === latitude && region.longitude === longitude
            );
            return isNewRegion ? [...prevRegions, { latitude, longitude }] : prevRegions;
          });
        }
      );
    };

    startLocationUpdates();
  }, []);

  const convertToScreenCoordinates = (latitude: number, longitude: number) => {
    const { width, height } = Dimensions.get('window');
    const latDelta = region.latitudeDelta;
    const lngDelta = region.longitudeDelta;

    const x = ((longitude - region.longitude + lngDelta / 2) / lngDelta) * width;
    const y = ((region.latitude - latitude + latDelta / 2) / latDelta) * height;
    return { x, y };
  };

  const metersToPixelsAtLatitude = (meters: number, latitude: number) => {
    const earthCircumference = 40075017; // Earth's circumference in meters
    const latDelta = region.latitudeDelta;
    const metersPerPixel = earthCircumference * Math.cos(latitude * Math.PI / 180) / Math.pow(2, 20 - Math.log2(latDelta));
    return meters / metersPerPixel;
  };

  const renderOverlay = () => {
    const { width, height } = Dimensions.get('window');
    const radius = metersToPixelsAtLatitude(5, region.latitude); // Change the value here to alter the default size

    return (
      <Svg height="100%" width="100%" style={styles.overlay}>
        <Defs>
          <Mask id="mask" x="0" y="0" width="100%" height="100%">
            <Rect height="100%" width="100%" fill="white" />
            {visitedRegions.map((location, index) => {
              const { x, y } = convertToScreenCoordinates(location.latitude, location.longitude);
              return (
                <SvgCircle key={index} cx={x} cy={y} r={radius} fill="black" />
              );
            })}
            {currentLocation && (
              <SvgCircle
                cx={convertToScreenCoordinates(currentLocation.latitude, currentLocation.longitude).x}
                cy={convertToScreenCoordinates(currentLocation.latitude, currentLocation.longitude).y}
                r={radius}
                fill="black"
              />
            )}
          </Mask>
        </Defs>
        <Rect height="100%" width="100%" fill="black" mask="url(#mask)" fillOpacity="0.7" />
      </Svg>
    );
  };

  const throttledSetRegion = useCallback(throttle(setRegion, 200), []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChange={throttledSetRegion}
        showsUserLocation={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      />
      <View style={styles.overlayContainer} pointerEvents="none">
        {renderOverlay()}
      </View>
    </View>
  );
};

export default App;

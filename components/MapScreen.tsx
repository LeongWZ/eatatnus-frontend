import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { RouteParams } from '@/components/canteen/types';

interface MapScreenProps {
  route: RouteProp<{ params: RouteParams }, 'params'>;
}

export default function MapScreen({ route }: MapScreenProps) {
  const { canteen } = route.params;

  if (!canteen || !canteen.location || !canteen.location.latitude || !canteen.location.longitude) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid location data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: canteen.location.latitude,
          longitude: canteen.location.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        }}
      >
        <Marker
          coordinate={{
            latitude: canteen.location.latitude,
            longitude: canteen.location.longitude,
          }}
          title={canteen.name}
          description={canteen.location.address}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

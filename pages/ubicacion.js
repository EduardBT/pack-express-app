import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Linking,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const destination = {
  latitude: -34.90737,
  longitude: -56.18882,
};

export default function UbicacionScreen() {
  const mapRef = useRef(null);

  const handleGetDirections = () => {
    const directionsURL = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;

    Linking.canOpenURL(directionsURL)
      .then((supported) => {
        if (supported) {
          Linking.openURL(directionsURL);
        } else {
          Alert.alert("Error", "No se puede abrir la aplicación de mapas");
        }
      })
      .catch((error) => {
        console.error("Error al obtener las direcciones", error);
        Alert.alert("Error", "Ocurrió un error al obtener las direcciones");
      });
  };

  const handleCenterMap = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: -34.90737,
        longitude: -56.18882,
        latitudeDelta: 0.009,
        longitudeDelta: 0.001,
      });
    }
  };

  const handleShowPhotos = () => {
    // Lógica para mostrar el grupo de fotos
  };

  return (
    <>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: -34.9011,
            longitude: -56.1645,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={destination} image={require("../assets/pin.png")}>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutText}>PACK EXPRESS</Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
        <TouchableOpacity style={styles.button} onPress={handleGetDirections}>
          <MaterialIcons name="directions" size={30} color="white" />
          <Text style={styles.buttonText}>Ir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerButton} onPress={handleCenterMap}>
          <MaterialIcons name="my-location" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#ffad1a",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
  centerButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#ffad1a",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  calloutContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "white",
    borderRadius: 10,
  },
  calloutText: {
    fontSize: 16,
  },
  showPhotosButton: {
    position: "absolute",
    bottom: 20,
    left: 120, // Ajusta la posición horizontal según sea necesario
    backgroundColor: "#ffad1a",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

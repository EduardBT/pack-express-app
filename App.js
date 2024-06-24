import React, { useState } from "react";
import {
  Button,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Linking,
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialIcons } from "react-native-vector-icons";
import UbicacionScreen from "./pages/ubicacion";
import Tarifas from "./pages/tarifas";
import Remesas from "./pages/remasas";
import Puntos_Canjeo from "./pages/puntos_canjeo";
import { Table, Row } from "react-native-table-component";

function HomeScreen() {
  const [guia, setGuia] = useState("");
  const [manifestoData, setManifestoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nonFound, setNonFound] = useState("");

  const buscarGuia = async () => {
    setIsLoading(true);
    let foundGuide = null;
    let manifest = null;
    let rastreo = null;
    let pan = false;
    let cub = false;
    let destino = "";
    let bulto = "";
    let peso = "";

    let xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://packexpress.com.uy/assets/server/server.php",
      true
    );
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        for (let i = 0; i < data.manifiestos.length; i++) {
          manifest = data.manifiestos[i];

          for (let j = 0; j < manifest.guias.length; j++) {
            const guiaObj = manifest.guias[j];

            if (
              guiaObj.guia.toString().toLowerCase().replace(/\s/g, "") ===
              guia.toString().toLowerCase().replace(/\s/g, "")
            ) {
              foundGuide = guia;
              bulto = guiaObj.bultos;
              peso = guiaObj.peso;
              destino = guiaObj.destino;
              pan = manifest.origen[0].Panama;
              cub = manifest.origen[0].Cuba;
              rastreo = manifest.rastreo;
              break;
            }
          }
        }

        if (foundGuide) {
          setManifestoData({
            foundGuide,
            bulto,
            peso,
            destino,
            pan,
            cub,
            rastreo,
          });
          setNonFound("");
        } else {
          setManifestoData(null);
        }
        console.log(manifestoData);
      }
      setNonFound("No se encontró ningún envío con ese código");
      setIsLoading(false);
    };
    xhr.send();
  };

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "top",
          flexDirection: "column",
          marginTop: 0,
        }}
      >
        <Modal visible={isLoading} transparent>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        </Modal>
        {manifestoData ? (
          <></>
        ) : (
          <View style={{ marginTop: 180 }}>
            <Image
              style={{ width: 160, height: 160 }}
              source={require("./assets/logo.png")}
            />
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <TextInput
            style={{
              width: 300,
              height: 40,
              borderWidth: 0.8,
              paddingHorizontal: 8,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              borderRightWidth: 0,
              borderColor: "rgb(255, 173, 26)",
            }}
            placeholder="No. Guía..."
            value={guia}
            onChangeText={(text) => setGuia(text)}
          />
          <View
            style={{
              backgroundColor: "rgb(255, 173, 26)",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 0.8,
              borderLeftWidth: 0,
              borderColor: "rgb(255, 173, 26)",
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
              padding: 4,
            }}
          >
            <TouchableOpacity onPress={buscarGuia}>
              <MaterialIcons name="search" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        {manifestoData ? (
          <>
            {manifestoData.cub == true ? (
              <Text
                onPress={() =>
                  Linking.openURL(
                    "https://www.correos.cu/rastreador-de-envios/"
                  )
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text style={{ textAlign: "left", color: "#007BFF" }}>
                  Continuar rastreo en Cuba »
                </Text>
              </Text>
            ) : null}
            <View style={{ width: 350, marginTop: 20, marginBottom: 30 }}>
              <Table>
                <Row
                  data={[
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#fff",
                        textAlign: "center",
                        fontSize: 16,
                      }}
                    >
                      No. Guía: {manifestoData.foundGuide.toUpperCase()}
                    </Text>,
                  ]}
                  style={{
                    backgroundColor: "rgba(255, 173, 26,0.8)",
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderTopWidth: 0,
                    borderBottomWidth: 0.8,
                    borderBottomColor: "rgb(166, 166, 166)",
                    alignItems: "center",
                  }}
                />
                <Row
                  data={[
                    <Text
                      style={{
                        marginLeft: 30,
                        fontWeight: "bold",
                        color: "rgb(130, 130, 130)",
                      }}
                    >
                      ORIGEN
                    </Text>,
                    <Text
                      style={{
                        marginLeft: 30,
                        color: "rgb(130, 130, 130)",
                      }}
                    >
                      Montevideo
                    </Text>,
                  ]}
                  style={{
                    backgroundColor: "#fff",
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderBottomWidth: 0.8,
                    borderBottomColor: "rgb(166, 166, 166)",
                  }}
                />
                <Row
                  data={[
                    <Text
                      style={{
                        marginLeft: 30,
                        fontWeight: "bold",
                        color: "rgb(130, 130, 130)",
                      }}
                    >
                      DESTINO
                    </Text>,
                    <Text
                      style={{
                        marginLeft: 30,
                        color: "rgb(130, 130, 130)",
                      }}
                    >
                      {manifestoData.destino}
                    </Text>,
                  ]}
                  style={{
                    backgroundColor: "#fff",
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderBottomWidth: 0.8,
                    borderBottomColor: "rgb(166, 166, 166)",
                  }}
                />
                <Row
                  data={[
                    <Text
                      style={{
                        marginLeft: 30,
                        fontWeight: "bold",
                        color: "rgb(130, 130, 130)",
                      }}
                    >
                      No. BULTOS
                    </Text>,
                    <Text
                      style={{
                        marginLeft: 30,
                        color: "rgb(130, 130, 130)",
                      }}
                    >
                      {manifestoData.bulto}
                    </Text>,
                  ]}
                  style={{
                    backgroundColor: "#fff",
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgb(166, 166, 166)",
                  }}
                />
                <Row
                  data={[
                    <Text
                      style={{
                        marginLeft: 30,
                        fontWeight: "bold",
                        color: "rgb(130, 130, 130)",
                      }}
                    >
                      PESO (KG)
                    </Text>,
                    <Text
                      style={{
                        marginLeft: 30,
                        color: "rgb(130, 130, 130)",
                      }}
                    >
                      {manifestoData.peso}
                    </Text>,
                  ]}
                  style={{
                    backgroundColor: "#fff",
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                />
              </Table>
              <Table>
                <Row
                  data={[
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#fff",
                        textAlign: "center",
                        fontSize: 16,
                      }}
                    >
                      FECHA - HORA
                    </Text>,
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#fff",
                        textAlign: "center",
                        fontSize: 16,
                      }}
                    >
                      HITO
                    </Text>,
                  ]}
                  style={{
                    backgroundColor: "rgba(255, 173, 26,0.8)",
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderTopWidth: 0,
                    borderBottomWidth: 0.8,
                    borderBottomColor: "rgb(166, 166, 166)",
                    alignItems: "center",
                  }}
                />
              </Table>
              {manifestoData.rastreo.map((item, index) => (
                <View key={index}>
                  <Table>
                    <Row
                      data={[
                        <Text
                          style={{
                            marginLeft: 30,
                            color: "rgb(130, 130, 130)",
                          }}
                        >
                          {item.fechaHora}
                        </Text>,
                        <Text
                          style={{
                            marginLeft: 30,
                            fontSize: 12,
                            margin: 5,
                            textAlign: "center",
                            color: "rgb(130, 130, 130)",
                          }}
                        >
                          {item.hito}
                        </Text>,
                      ]}
                      style={{
                        backgroundColor: "#fff",
                        paddingTop: 10,
                        paddingBottom: 10,
                        borderBottomWidth: 0.8,
                        borderBottomColor: "rgb(166, 166, 166)",
                      }}
                    />
                  </Table>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={{ marginTop: 20, padding: 10 }}>
            <Text>{nonFound}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const destination = {
    latitude: -34.90737,
    longitude: -56.18882,
  };

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

  const handlePhonePress = () => {
    const phoneNumber = "+59893594297";
    const message = "¡Hola! Necesito información de sus servicios.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
    Linking.openURL(whatsappUrl);
  };

  const callPhoneNumber = () => {
    const phoneNumber = "2902 7227";
    const telUrl = `tel:${phoneNumber}`;
    Linking.openURL(telUrl);
  };

  const handleWebPress = () => {
    const instagramURL = "https://packexpress.com.uy/index.html";
    Linking.openURL(instagramURL);
  };

  const navigateToInstagram = () => {
    const instagramURL =
      "https://www.instagram.com/packexpressuruguay/?next=https%3A%2F%2Fwww.instagram.com%2Fpackexpressuruguay%2F%3Fhl%3Des-es&hl=es-es";
    Linking.openURL(instagramURL);
  };

  const navigateToFaceboock = () => {
    const instagramURL =
      "https://www.facebook.com/p/PACK-Express-Uruguay-SAS-100063612524908/";
    Linking.openURL(instagramURL);
  };

  return (
    <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 25 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={{ paddingHorizontal: 16 }}>
        <TouchableOpacity style={styles.button} onPress={handleGetDirections}>
          <MaterialIcons name="location-on" size={24} color="black" />
          <Text style={styles.buttonText}>Ubicación</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePhonePress}>
          <MaterialIcons name="phone-android" size={24} color="black" />
          <Text style={styles.buttonText}> 093 594 297</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={callPhoneNumber}>
          <MaterialIcons name="phone" size={24} color="black" />
          <Text style={styles.buttonText}> 2902 7227</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleWebPress()}
        >
          <MaterialIcons name="web" size={24} color="black" />
          <Text style={styles.buttonText}>packexpress.com.uy</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderBottomColor: "rgba(0,0,0,0.2)",
          borderBottomWidth: 1,
          marginHorizontal: 16,
        }}
      />
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigateToInstagram()}>
            <Image
              source={require("./assets/insta.png")}
              style={{ width: 30, height: 30, marginTop: 2, marginRight: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToFaceboock()}>
            <MaterialIcons name="facebook" size={32} color="blue" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen
            name="Rastrear envio"
            component={HomeScreen}
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="track-changes" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Puntos Acumulados"
            component={Puntos_Canjeo}
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="person-search" size={size} color={color} />
              ),
            }}
          />
          {/* <Drawer.Screen
            name="Ubicación"
            component={UbicacionScreen}
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="location-on" size={size} color={color} />
              ),
            }}
          /> */}
          <Drawer.Screen
            name="Tarifas"
            component={Tarifas}
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="attach-money" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Recargas y remesas"
            component={Remesas}
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="payment" size={size} color={color} />
              ),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  loadingText: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#007BFF",
  },
  button: {
    flexDirection: "row",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonText: { marginLeft: 8 },
});

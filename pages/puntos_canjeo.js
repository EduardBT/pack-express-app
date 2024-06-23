import React, { useState } from "react";
import { MaterialIcons } from "react-native-vector-icons";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  ActivityIndicator,
} from "react-native";

const Puntos_Canjeo = () => {
  const [cedula, setCedula] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clientesData, setClientesData] = useState(null);
  const [nonFound, setNonFound] = useState("");

  const maskString = (str) => {
    if (str.length === 0) {
      return "";
    }
    return str[0] + "*".repeat(str.length - 1);
  };

  const buscar = async () => {
    setIsLoading(true);
    console.log(cedula.replace(/\.|_|-/g, ""));
    let client = null;
    let dni = "";
    let nombre = "";
    let apellidos = "";
    let pesoTotal = 0;
    let idGuiaMaxCanjeado = 0;

    let xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://packexpress.com.uy/assets/server/serverPuntos.php",
      true
    );
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        for (let i = 0; i < data.clientes.length; i++) {
          client = data.clientes[i];
          if (
            client.dni.replace(/\.|_|-/g, "") === cedula.replace(/\.|_|-/g, "")
          ) {
            dni = client.dni;
            nombre = client.nombre;
            apellidos = client.apellidos;

            if (client.canjear === 1) {
              idGuiaMaxCanjeado = client.id_guia;
            } else {
              if (client.id_guia >= idGuiaMaxCanjeado) {
                pesoTotal += parseFloat(client.peso_real);
              }
            }
            setClientesData({
              dni,
              nombre,
              apellidos,
              pesoTotal,
            });
            setNonFound("");
            break;
          } else {
            setClientesData(null);
            setNonFound("No se encuentra registrado en el sistema");
          }
        }
      }
      //   console.log(clientesData);
      //   console.log(Math.floor(pesoTotal));
      setIsLoading(false);
    };
    xhr.send();
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 35,
          marginLeft: 35,
        }}
      >
        <Modal visible={isLoading} transparent>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        </Modal>
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
          placeholder="No. Cédula..."
          keyboardType="numeric"
          value={cedula}
          onChangeText={(text) => setCedula(text)}
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
          <TouchableOpacity onPress={buscar}>
            <MaterialIcons name="search" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <>
        <View
          style={{
            marginTop: 25,
            marginLeft: 25,
            marginRight: 25,
            backgroundColor: "rgba(255, 173, 26,0.7)",
            paddingTop: 10,
            paddingBottom: 10,
            borderTopWidth: 0,
            borderBottomWidth: 0.8,
            borderBottomColor: "rgb(166, 166, 166)",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
              fontSize: 16,
            }}
          >
            {clientesData != null ? clientesData.dni : "X.XXX.XXX-X"}
          </Text>
        </View>
        <View style={styles.containerPtos}>
          <View style={styles.leftView}>
            <Text style={{ textAlign: "center" }}>
              <MaterialIcons
                name="person"
                size={65}
                color="rgba(255, 173, 26,0.6)"
              />
            </Text>
          </View>
          <View style={styles.rightView}>
            <Text style={{ marginBottom: 15 }}>
              <Text style={{ fontWeight: "bold" }}>Nombre: </Text>
              {clientesData
                ? maskString(clientesData.nombre)
                : "********* *********"}
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Apellidos: </Text>
              {clientesData
                ? maskString(clientesData.apellidos)
                : "********* *********"}
            </Text>
          </View>
        </View>
        <View style={styles.containerP}>
          <Text style={{ fontWeight: "bold" }}>Puntos Acumulados: </Text>
          <Text style={{ fontSize: 20, marginTop: 10, marginBottom: 10 }}>
            {clientesData ? (
              <Text style={{ fontSize: 20, marginTop: 10, marginBottom: 10 }}>
                {Math.floor(clientesData.pesoTotal) * 10 +
                  " " +
                  "Puntos" +
                  " " +
                  "=" +
                  " " +
                  Math.floor(clientesData.pesoTotal) * 10 +
                  " " +
                  "UYU"}
              </Text>
            ) : (
              "XXXX Puntos = XXXX UYU"
            )}
          </Text>
        </View>
      </>
      <View>
        {clientesData ? (
          <></>
        ) : (
          <Text style={{ marginTop: 25, marginLeft: 45, fontSize: 15 }}>
            {nonFound}
          </Text>
        )}
      </View>
    </>
  );
};

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

  containerPtos: {
    flexDirection: "row", // Alinea los Views horizontalmente
    marginLeft: 25,
    marginRight: 25,
  },
  leftView: {
    flex: 3, // Ocupa 3 partes del espacio total
    backgroundColor: "#ffff", // Ejemplo de color
    borderLeftWidth: 1,
    borderColor: "rgb(255, 173, 26)",
    padding: 10,
  },
  rightView: {
    flex: 7, // Ocupa 7 partes del espacio total
    backgroundColor: "#ffff", // Ejemplo de color
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgb(255, 173, 26)",
    padding: 10,
  },
  containerP: {
    marginLeft: 25,
    marginRight: 25,
    height: 90,
    backgroundColor: "#ffff", // Ejemplo de color
    borderWidth: 1,
    borderColor: "rgb(255, 173, 26)",
    padding: 10,
  },
});

export default Puntos_Canjeo;

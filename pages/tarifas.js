import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";

const Tarifas = () => {
  const [pais, setPais] = useState("");
  const [peso, setPeso] = useState("");
  const [pesoVol, setPesoVol] = useState("");
  const [costo, setCosto] = useState("");
  const [costoPV, setCostoPV] = useState("");
  const [tipoPeso, setTipoPeso] = useState("real");
  const [largo, setLargo] = useState("");
  const [ancho, setAncho] = useState("");
  const [altura, setAltura] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showErrorMessagePV, setShowErrorMessagePV] = useState(false);

  const handleCalcular = async () => {
    try {
      if (pais == "Cuba") {
        const response = await fetch(
          "https://packexpress.com.uy/assets/json/kilosCuba.json"
        );
        if (!response.ok) {
          throw new Error("Error al obtener el archivo JSON");
        }
        const data = await response.json();
        const valores = data;
        let kg;
        let costoKg;

        const redondearCercano = (numero) => {
          // Calcula la diferencia con el número inferior, superior y el valor intermedio
          const diferenciaInferior = Math.abs(numero - Math.floor(numero));
          const diferenciaSuperior = Math.abs(numero - Math.ceil(numero));
          const diferenciaMedio = Math.abs(numero - (Math.floor(numero) + 0.5));

          // Compara las diferencias y redondea al más cercano
          if (numero < 25) {
            if (
              diferenciaInferior <= diferenciaSuperior &&
              diferenciaInferior <= diferenciaMedio
            ) {
              return Math.floor(numero);
            } else if (
              diferenciaSuperior <= diferenciaInferior &&
              diferenciaSuperior <= diferenciaMedio
            ) {
              return Math.ceil(numero);
            } else {
              return Math.floor(numero) + 0.5; // Redondea al valor intermedio
            }
          } else {
            if (diferenciaInferior <= diferenciaSuperior) {
              return Math.floor(numero);
            } else {
              return Math.ceil(numero);
            }
          }
        };

        for (let i = 0; i < valores.length; i++) {
          if (valores[i]["Kg"] == redondearCercano(peso)) {
            kg = peso;
            costoKg = valores[i]["USD"];
          }
        }

        if (tipoPeso == "real") {
          if (Number(peso) <= 50) {
            if (kg) {
              setCosto(costoKg + " USD");
            }
          } else {
            const kg = valores.find((item) => item.Kg === 50);
            const costoBase = parseFloat(kg.USD);
            const kilosAdicionales = peso - 50;
            const costoAdicional = kilosAdicionales * 15;
            const costoTotal = costoBase + costoAdicional;
            setCosto(costoTotal + " USD");
          }
        } else {
          try {
            const pesoVol =
              (parseFloat(largo) * parseFloat(ancho) * parseFloat(altura)) /
              5000;
            const kg = valores.find(
              (item) =>
                item.Kg == parseFloat(redondearCercano(pesoVol)).toFixed(1)
            );

            if (pesoVol <= 50) {
              if (kg) {
                console.log("llega");
                setCostoPV(kg.USD + " USD");
              }
            } else {
              const kg50 = valores.find(
                (item) => item.Kg.replace(",", ".") === "50.0"
              );
              const costoBase = parseFloat(kg50.USD);
              const kilosAdicionales = pesoVol - 50;
              const costoAdicional = kilosAdicionales * 15;
              const costoTotal = costoBase + costoAdicional;
              setCostoPV(costoTotal + " USD");
            }
          } catch (error) {
            console.error("Error:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: "white",
        marginTop: 30,
        margin: 15,
        borderWidth: 1,
        borderColor: "#CCCCCC",
      }}
    >
      <View style={{ flexDirection: "row", marginBottom: 15 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="real"
            status={tipoPeso === "real" ? "checked" : "unchecked"}
            onPress={() => setTipoPeso("real")}
            color="#007BFF"
          />
          <Text style={{ marginRight: 30 }}>Peso Real</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="volumetrico"
            status={tipoPeso === "volumetrico" ? "checked" : "unchecked"}
            onPress={() => setTipoPeso("volumetrico")}
            color="#007BFF"
          />
          <Text>Peso Volumétrico</Text>
        </View>
      </View>
      <View
        style={{
          marginBottom: 15,
          height: 50,
          borderWidth: 1,
          borderColor: "#CCCCCC",
          borderRadius: 12,
        }}
      >
        <Picker
          selectedValue={pais}
          style={{ height: 50 }}
          onValueChange={(itemValue) => setPais(itemValue)}
        >
          <Picker.Item label="Seleccionar País" value="" />
          <Picker.Item label="Cuba" value="Cuba" />
          <Picker.Item label="Venezuela" value="Venezuela" />
          <Picker.Item label="Estados Unidos" value="Estados Unidos" />
        </Picker>
      </View>
      {tipoPeso === "real" && (
        <>
          <TextInput
            keyboardType="numeric"
            value={peso}
            onChangeText={(text) => {
              if (pais === "") {
                setShowErrorMessage(true);
              } else {
                setPeso(text);
                setShowErrorMessage(false);
              }
            }}
            style={{
              marginTop: 15,
              marginBottom: 15,
              height: 50,
              borderWidth: 1,
              padding: 10,
              borderColor: "#CCCCCC",
              borderRadius: 12,
            }}
            placeholder="Peso (KG)"
            // editable={pais !== ""} // Habilita el TextInput si hay un país seleccionado
          />

          {showErrorMessage && (
            <Text style={{ color: "red" }}>Debes seleccionar un país</Text>
          )}

          <TextInput
            value={costo}
            editable={false}
            style={{
              marginTop: 15,
              marginBottom: 15,
              height: 50,
              borderWidth: 1,
              padding: 10,
              color: "black",
              borderColor: "#CCCCCC",
              borderRadius: 12,
            }}
            placeholder="Costo (USD)"
          />
        </>
      )}
      {tipoPeso === "volumetrico" && (
        <>
          {showErrorMessagePV && (
            <Text style={{ color: "red" }}>Debes seleccionar un país</Text>
          )}
          <TextInput
            keyboardType="numeric"
            value={largo}
            onChangeText={(text) => {
              if (pais === "") {
                setShowErrorMessagePV(true);
              } else {
                setLargo(text);
                setShowErrorMessagePV(false);
              }
            }}
            style={{
              marginTop: 15,
              marginBottom: 15,
              height: 50,
              borderWidth: 1,
              padding: 10,
              borderColor: "#CCCCCC",
              borderRadius: 12,
            }}
            placeholder="Largo (cm)"
          />
          <TextInput
            keyboardType="numeric"
            value={ancho}
            onChangeText={(text) => {
              if (pais === "") {
                setShowErrorMessagePV(true);
              } else {
                setAncho(text);
                setShowErrorMessagePV(false);
              }
            }}
            style={{
              marginTop: 15,
              marginBottom: 15,
              height: 50,
              borderWidth: 1,
              padding: 10,
              borderColor: "#CCCCCC",
              borderRadius: 12,
            }}
            placeholder="Ancho (cm)"
          />
          <TextInput
            keyboardType="numeric"
            value={altura}
            onChangeText={(text) => {
              if (pais === "") {
                setShowErrorMessagePV(true);
              } else {
                setAltura(text);
                setShowErrorMessagePV(false);
              }
            }}
            style={{
              marginTop: 15,
              marginBottom: 15,
              height: 50,
              borderWidth: 1,
              padding: 10,
              borderColor: "#CCCCCC",
              borderRadius: 12,
            }}
            placeholder="Altura (cm)"
          />
          <TextInput
            value={costoPV}
            editable={false}
            style={{
              marginTop: 15,
              marginBottom: 15,
              height: 50,
              borderWidth: 1,
              padding: 10,
              color: "black",
              borderColor: "#CCCCCC",
              borderRadius: 12,
            }}
            placeholder="Costo (USD)"
          />
        </>
      )}

      <Button
        title="Calcular"
        onPress={handleCalcular}
        icon={<Ionicons name="calculator" size={24} color="white" />}
        style={{ marginTop: 16 }}
      />
    </View>
  );
};

export default Tarifas;

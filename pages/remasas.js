import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Linking, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { RadioButton } from "react-native-paper";

const Remesas = () => {
  const [tipo, setTipo] = useState("remesa");
  const [monedaPago, setMonedapago] = useState("");
  const [monedaRecibe, setMonedaRecibe] = useState("");
  const [pago, setPago] = useState(0);
  const [recibe, setRecibe] = useState(0);
  const [movil, setMovil] = useState("");
  const [seleccionRecarga, setSeleccionRecarga] = useState("");
  const [ofertaSF, setOfertaSF] = useState("");
  const [ofertaDatos, setOfertaDatos] = useState("");
  const [ofertaSR, setOfertaSR] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleCalcular = () => {
    if (tipo === "remesa") {
      let recibeValue;

      if (monedaPago === "usd") {
        if (monedaRecibe === "cup") {
          recibeValue = parseFloat(pago) * 41 * 7.5 + " CUP";
        } else {
          recibeValue = parseFloat(pago) + " MLC";
        }
      } else {
        if (monedaRecibe === "mlc") {
          recibeValue = parseInt(parseFloat(pago) / 41) + " MLC";
        } else {
          recibeValue = parseFloat(pago) * 7.5 + " CUP";
        }
      }

      const msjValue = `Operación a realizar: ${tipo.toUpperCase()}\nDeposita: ${
        pago + " " + monedaPago.toUpperCase()
      }\nRecibe: ${recibeValue}\nNotificar a: ${movil}`;

      setRecibe(recibeValue);
      setMensaje(msjValue);
    } else {
      let recibeValue = "";
      let msjValue = "";
      let costo = "";

      if (seleccionRecarga === "super_recargas") {
        if (ofertaSR === "Super Saldo") {
          recibeValue = "SUPER SALDO";
          costo = "750 UYU";
        } else if (ofertaSR === "Super Datos") {
          recibeValue = "SUPER DATOS";
          costo = "750 UYU";
        } else if (ofertaSR === "Mega Recarga") {
          recibeValue = "MEGA RECARGA";
          costo = "750 UYU";
        }
      } else if (seleccionRecarga === "saldo_fijo") {
        if (ofertaSF === "450") {
          recibeValue = "3000 CUP";
          costo = "450 UYU";
        } else if (ofertaSF === "400") {
          recibeValue = "2500 CUP";
          costo = "400 UYU";
        } else if (ofertaSF === "350") {
          recibeValue = "2000 CUP";
          costo = "350 UYU";
        } else if (ofertaSF === "300") {
          recibeValue = "1500 CUP";
          costo = "300 UYU";
        } else if (ofertaSF === "200") {
          recibeValue = "1000 CUP";
          costo = "200 UYU";
        } else if (ofertaSF === "100") {
          recibeValue = "500 CUP";
          costo = "100 UYU";
        }
      } else if (seleccionRecarga === "datos") {
        if (ofertaDatos === "350") {
          recibeValue = "LTE 32 GB PLUS";
          costo = "350 UYU";
        } else if (ofertaDatos === "200") {
          recibeValue = "LTE 16 GB";
          costo = "200 UYU";
        } else if (ofertaDatos === "100") {
          recibeValue = "EXTRA";
          costo = "100 UYU";
        }
      }
      msjValue = `Operación a realizar: ${tipo.toUpperCase()}\nDeposita: ${costo}\nRecarga: ${recibeValue}\nNotificar a: ${movil}`;
      setRecibe(recibeValue);
      setMensaje(msjValue);
    }
  };

  useEffect(() => {
    if (recibe !== 0) {
      const phoneNumber = "+59893594297";
      const message = mensaje;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
      Alert.alert("Mensaje a enviar:", mensaje, [
        {
          text: "Enviar",
          onPress: () => {
            Linking.openURL(whatsappUrl);
            setSeleccionRecarga("");
            setOfertaSF("");
            setOfertaDatos("");
            setOfertaSR("");
            setMensaje("");
            setMonedapago("");
            setMonedaRecibe("");
            setMovil("");
            setPago(0);
            setRecibe(0);
          },
        },
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => {
            setSeleccionRecarga("");
            setOfertaSF("");
            setOfertaDatos("");
            setOfertaSR("");
            setMensaje("");
            setMonedapago("");
            setMonedaRecibe("");
            setMovil("");
            setPago(0);
            setRecibe(0);
          },
        },
      ]);
    }
  }, [recibe]);

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
            value="remesa"
            status={tipo === "remesa" ? "checked" : "unchecked"}
            onPress={() => setTipo("remesa")}
            color="#007BFF"
          />
          <Text style={{ marginRight: 30 }}>Remesas</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="recarga"
            status={tipo === "recarga" ? "checked" : "unchecked"}
            onPress={() => setTipo("recarga")}
            color="#007BFF"
          />
          <Text>Recargas</Text>
        </View>
      </View>

      {tipo === "remesa" && (
        <>
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
              selectedValue={monedaPago}
              style={{ height: 50 }}
              onValueChange={(itemValue) => setMonedapago(itemValue)}
            >
              <Picker.Item label="Moneda de pago" value="" />
              <Picker.Item label="Dólar (USD)" value="usd" />
              <Picker.Item label="Peso Uruguayo (UYU)" value="uyu" />
            </Picker>
          </View>
          {monedaPago !== "usd" &&
            monedaRecibe === "cup" &&
            parseFloat(pago) < 1000 && (
              <Text style={{ color: "red", marginBottom: 10, fontSize: 13 }}>
                El monto a enviar debe ser igual o mayor a 1000 UYU
              </Text>
            )}
          <TextInput
            keyboardType="numeric"
            value={pago.toString()}
            onChangeText={(text) => setPago(text)}
            style={{
              marginBottom: 15,
              height: 50,
              borderWidth: 1,
              padding: 10,
              borderColor: "#CCCCCC",
              borderRadius: 12,
            }}
            placeholder="Monto a enviar"
          />

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
              selectedValue={monedaRecibe}
              style={{ height: 50 }}
              onValueChange={(itemValue) => setMonedaRecibe(itemValue)}
            >
              <Picker.Item label="Moneda a recibir" value="" />
              <Picker.Item label="CUP" value="cup" />
              <Picker.Item label="MLC" value="mlc" />
            </Picker>
          </View>
          <Text
            style={{
              marginBottom: 15,
              height: 50,
              borderWidth: 1,
              padding: 15,
              borderColor: "#CCCCCC",
              borderRadius: 12,
              color: "#007BFF",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >{`Recibe: ${recibe}`}</Text>
        </>
      )}
      {tipo === "recarga" && (
        <>
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
              selectedValue={seleccionRecarga}
              style={{ height: 50 }}
              onValueChange={(itemValue) => setSeleccionRecarga(itemValue)}
            >
              <Picker.Item label="Seleccionar..." value="" />
              <Picker.Item label="Saldo Fijo" value="saldo_fijo" />
              <Picker.Item label="Datos" value="datos" />
              <Picker.Item label="Super Recargas" value="super_recargas" />
            </Picker>
          </View>
          {seleccionRecarga === "super_recargas" && (
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
                selectedValue={ofertaSR}
                style={{ height: 50 }}
                onValueChange={(itemValue) => setOfertaSR(itemValue)}
              >
                <Picker.Item label="Seleccionar Oferta ..." value="" />
                <Picker.Item
                  label="Super Saldo (5000 CUP saldo fijo)"
                  value="Super Saldo"
                />
                <Picker.Item
                  label="Super Datos (80 GB datos móviles)"
                  value="Super Datos"
                />
                <Picker.Item
                  label="Mega Recarga (3000 CUP / 32 GB)"
                  value="Mega Recarga"
                />
              </Picker>
            </View>
          )}
          {seleccionRecarga === "saldo_fijo" && (
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
                selectedValue={ofertaSF}
                style={{ height: 50 }}
                onValueChange={(itemValue) => setOfertaSF(itemValue)}
              >
                <Picker.Item label="Seleccionar Oferta ..." value="" />
                <Picker.Item label="3000 CUP" value="450" />
                <Picker.Item label="2500 CUP" value="400" />
                <Picker.Item label="2000 CUP" value="350" />
                <Picker.Item label="1500 CUP" value="300" />
                <Picker.Item label="1000 CUP" value="200" />
                <Picker.Item label="500 CUP" value="100" />
              </Picker>
            </View>
          )}
          {seleccionRecarga === "datos" && (
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
                selectedValue={ofertaDatos}
                style={{ height: 50 }}
                onValueChange={(itemValue) => setOfertaDatos(itemValue)}
              >
                <Picker.Item label="Seleccionar Oferta ..." value="" />
                <Picker.Item label="LTE 32 GB PLUS" value="350" />
                <Picker.Item label="LTE 16 GB" value="200" />
                <Picker.Item label="EXTRA 8 GB (75 min / 80 sms)" value="100" />
              </Picker>
            </View>
          )}
        </>
      )}
      <TextInput
        keyboardType="numeric"
        value={movil}
        onChangeText={(text) => setMovil(text)}
        style={{
          marginBottom: 15,
          height: 50,
          borderWidth: 1,
          padding: 10,
          borderColor: "#CCCCCC",
          borderRadius: 12,
        }}
        placeholder="Número a notificar"
      />

      <Button
        title="Solicitar"
        onPress={handleCalcular}
        style={{ marginTop: 16 }}
      />

      {tipo === "remesa" && (
        <Text
          style={{
            color: "black",
            marginTop: 15,
            fontSize: 13,
            textAlign: "center",
            lineHeight: 18,
            fontWeight: "bold",
          }}
        >
          Para completar la solicitud, por favor envíe el número de tarjeta o
          adjunte una foto a través de WhatsApp.
        </Text>
      )}
    </View>
  );
};

export default Remesas;

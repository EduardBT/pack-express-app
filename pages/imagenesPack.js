import React, { useState } from "react";
import { View, TouchableOpacity, Modal, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  button: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
  },
  showPhotosButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  centerButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  thumbnailContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  thumbnailImage: {
    marginTop: 10,
    width: 60,
    height: 60,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
    borderRadius: 5,
  },
});

const CouruselImage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleShowPhotos = (imageSource) => {
    setSelectedImage(imageSource);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <Icon name="close" size={20} color="white" />
          </TouchableOpacity>
          <Image style={styles.modalImage} source={selectedImage} />
        </View>
      </Modal>

      <View style={styles.thumbnailContainer}>
        <TouchableOpacity
          onPress={
            () => handleShowPhotos(require("../assets/pack2.jpeg")) // Replace with the actual thumbnail image source
          }
        >
          <Image
            style={styles.thumbnailImage}
            source={require("../assets/pack2.jpeg")} // Replace with the actual thumbnail image source
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={
            () => handleShowPhotos(require("../assets/pack3.jpeg")) // Replace with the actual thumbnail image source
          }
        >
          <Image
            style={styles.thumbnailImage}
            source={require("../assets/pack3.jpeg")} // Replace with the actual thumbnail image source
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={
            () => handleShowPhotos(require("../assets/pack1.jpeg")) // Replace with the actual thumbnail image source
          }
        >
          <Image
            style={styles.thumbnailImage}
            source={require("../assets/pack1.jpeg")} // Replace with the actual thumbnail image source
          />
        </TouchableOpacity>

        {/* Add more TouchableOpacity components for additional thumbnails */}
      </View>
    </>
  );
};

export default CouruselImage;

import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { IconButton } from "react-native-paper";
import { addNote, deleteNote, updateNote } from "../utils/api";
import { Calendar } from "react-native-calendars";
import Modal from "react-native-modal";

const NoteScreen = ({ navigation, route }: any) => {
  const params = route?.params || {};

  const [id, setId] = useState<number | null>(params?.noteId || null);
  const [title, setTitle] = useState<string>(params?.noteTitle || "");
  const [text, setText] = useState<string>(params?.note || "");
  const [mark, setMark] = useState<boolean>(params?.mark || false);
  const [noteDate, setNoteDate] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const handleTogglePin = () => {
    setIsTyping(true);
    setMark((prev) => !prev);
  };

  const handleDeleteNote = () => {
    Alert.alert("Hapus Catatan", "Apakah Anda yakin ingin menghapus catatan ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        onPress: async () => {
          try {
            if (id) {
              await deleteNote(id);
              navigation.goBack();
            }
          } catch (error) {
            console.error("Gagal menghapus catatan:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <IconButton icon={mark ? "pin" : "pin-outline"} iconColor="#fff" size={25} onPress={handleTogglePin} />
          {id && <IconButton icon="trash-can" iconColor="#fff" size={25} onPress={handleDeleteNote} />}
        </View>
      ),
    });
  }, [navigation, mark]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDayPress = (day: any) => {
    setNoteDate(day.dateString);
    setIsTyping(true);
    toggleModal();
  };

  useEffect(() => {
    if (!isTyping) return;

    const debounceSave = setTimeout(async () => {
      try {
        const res = id
          ? await updateNote(id, title, text, mark, noteDate)
          : await addNote(title, text, mark, noteDate);

        if (!id) setId(res?.note?.id);
      } catch (error) {
        console.error("Gagal menyimpan catatan:", error);
      }
    }, 1000);

    return () => clearTimeout(debounceSave);
  }, [title, text, mark, noteDate]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container} keyboardVerticalOffset={100}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.innerContainer}>
          <View style={styles.rowBetween}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  setIsTyping(true);
                }}
                placeholder="Tulis Judul..."
                placeholderTextColor="#ccc"
              />
            </View>
            <IconButton icon="calendar" iconColor="#fff" size={25} onPress={toggleModal} />
          </View>

          <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
            <View style={styles.modalContainer}>
              <Calendar onDayPress={handleDayPress} markedDates={{ [noteDate]: { selected: true, selectedColor: "blue" } }} />
            </View>
          </Modal>

          <TextInput
            style={styles.textArea}
            value={text}
            onChangeText={(text) => {
              setText(text);
              setIsTyping(true);
            }}
            placeholder="Tulis sesuatu..."
            placeholderTextColor="#ccc"
            multiline
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7E64FF",
  },
  innerContainer: {
    flexGrow: 1,
    padding: 20,
    marginBottom: 20,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  label: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  input: {
    color: "#fff",
    fontSize: 17,
    maxWidth: "78%",
  },
  textArea: {
    color: "#fff",
    fontSize: 17,
    marginTop: 20,
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignSelf: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});

export default NoteScreen;

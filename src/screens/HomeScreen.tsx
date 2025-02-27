import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from "react-native";
import { Searchbar, Icon } from "react-native-paper";
import { FloatingAction } from "react-native-floating-action";
import { useFocusEffect } from "@react-navigation/native";
import { getNotes } from "../utils/api";

// Interface untuk tipe data Note
interface Note {
  id: number;
  title: string;
  note: string;
  mark: boolean;
  note_date: string;
}

const HomeScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  // Fungsi untuk mengambil data catatan dari API
  const fetchNotes = async () => {
    try {
      const data: Note[] = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error("Gagal mengambil catatan:", error);
    }
  };

  // Mengambil ulang data catatan saat layar difokuskan kembali
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  // Filter catatan berdasarkan teks pencarian
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.note.toLowerCase().includes(search.toLowerCase())
  );

  // Render setiap item catatan
  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Note", {
          noteId: item.id,
          noteTitle: item.title,
          noteDate: item.note_date,
          note: item.note,
          mark: item.mark,
        })
      }
      style={styles.noteContainer}
    >
      <Text style={styles.noteText}>{item.title}</Text>
      <View style={styles.noteFooter}>
        <Text style={styles.dateText}>{item.note_date}</Text>
        {item.mark && <Icon source="pin" color={'#fff'} size={20} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#120827" />
      
      {/* Searchbar untuk pencarian catatan */}
      <Searchbar
        style={styles.searchbar}
        placeholder="Cari catatan..."
        onChangeText={setSearch}
        value={search}
      />

      {/* Daftar catatan */}
      <FlatList
        data={filteredNotes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Tidak ada catatan</Text>}
      />

      {/* Tombol tambah catatan */}
      <FloatingAction
        color="#CCC2FE"
        onPressMain={() => navigation.navigate("Note")}
        showBackground={false}
        floatingIcon={<Icon source="plus" size={24} color="#FFF" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#120827" },
  searchbar: { backgroundColor: "#CCC2FE", marginBottom: 20 },
  noteContainer: { backgroundColor: "#7E64FF", padding: 20, borderRadius: 8, marginVertical: 10 },
  noteText: { color: "#fff" },
  noteFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  dateText: { color: "#fff" },
  emptyText: { color: "#ccc", textAlign: "center", marginTop: 20 },
});

export default HomeScreen;

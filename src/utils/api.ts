import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// URL API backend (sesuaikan jika berubah)
const API_URL = "https://76ae-110-138-88-237.ngrok-free.app/api";

/**
 * Fungsi untuk mendapatkan header otorisasi dengan token dari AsyncStorage
 */
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Melakukan autentikasi pengguna dengan username dan password.
 */
export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message || "Gagal masuk";
    }
    throw "Gagal masuk";
  }
};

/**
 * Mendaftarkan pengguna baru dengan username dan password.
 */
export const register = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message || "Gagal mendaftar";
    }
    throw "Gagal mendaftar";
  }
};

/**
 * Menghapus token autentikasi dari penyimpanan lokal.
 */
export const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");
  } catch (error) {
    console.error("Terjadi kesalahan saat keluar:", error);
  }
};

/**
 * Mengambil daftar catatan pengguna dari server.
 */
export const getNotes = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(`${API_URL}/notes`, { headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message || "Gagal mengambil catatan";
    }
    throw "Gagal mengambil catatan";
  }
};

/**
 * Menambahkan catatan baru ke server.
 */
export const addNote = async (title:string, note:string, mark: Boolean, noteDate: string) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(
      `${API_URL}/note`, 
      { title, note, mark, noteDate }, 
      { headers }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message || "Gagal menambahkan catatan";
    }
    throw "Gagal menambahkan catatan";
  }
};

/**
 * Memperbarui catatan berdasarkan ID catatan.
 */
export const updateNote = async (noteId: number, title:string, note:string, mark: Boolean, noteDate: string) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.put(
      `${API_URL}/note/${noteId}`, 
      { title, note, mark, noteDate }, 
      { headers }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message || "Gagal memperbarui catatan";
    }
    throw "Gagal memperbarui catatan";
  }
};

/**
 * Menghapus catatan berdasarkan ID catatan.
 */
export const deleteNote = async (noteId: number) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.delete(`${API_URL}/notes/${noteId}`, { headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message || "Gagal menghapus catatan";
    }
    throw "Gagal menghapus catatan";
  }
};

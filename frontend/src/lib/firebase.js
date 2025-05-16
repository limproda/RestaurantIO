import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Configuración de Firebase. Se usan las variables de entorno definidas en el archivo .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicialización de Firebase y obtención de la instancia de Storage
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Función para subir un archivo a Firebase Storage
export const uploadFile = async (file, path) => {
    try {
        const storageRef = ref(storage, path); // Obtenemos la referencia al bucket de Firebase Storage
        const snapshot = await uploadBytes(storageRef, file); // Subida del archivo
        const downloadURL = await getDownloadURL(snapshot.ref); // Obtenemos la URL de descarga
        return downloadURL; // Devolvemos la URL de descarga
    } catch (error) {
        console.error("Error uploading file:", error); // En caso de error, lo mostramos por consola
        throw error;
    }
};

// Función para eliminar un archivo de Firebase Storage
export const deleteFile = async (path) => {
    try {
        const storageRef = ref(storage, path); // Obtenemos la referencia al bucket de Firebase Storage
        await deleteObject(storageRef); // Eliminamos el archivo
    } catch (error) {
        console.error("Error deleting file:", error); // En caso de error, lo mostramos por consola
        throw error;
    }
};

export { storage }; // Exportamos la instancia de Storage para usar en otros módulos
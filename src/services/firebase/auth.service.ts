import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth'
import type { User, UserCredential, Unsubscribe } from 'firebase/auth'
import { auth } from './config'

// Configurar persistencia a nivel de sesión del navegador (sessionStorage).
// Al cerrar la pestaña o la ventana del navegador, la sesión se destruye automáticamente.
setPersistence(auth, browserSessionPersistence).catch(() => {
  // Manejo seguro para entornos donde sessionStorage esté restringido
})

/**
 * Registra un nuevo usuario utilizando correo electrónico y contraseña.
 * Asegura que la sesión solo persista mientras la pestaña permanezca abierta.
 */
export const registerUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  await setPersistence(auth, browserSessionPersistence)
  return createUserWithEmailAndPassword(auth, email, password)
}

/**
 * Inicia sesión con correo electrónico y contraseña existentes.
 * Asegura que la sesión solo persista mientras la pestaña permanezca abierta.
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  await setPersistence(auth, browserSessionPersistence)
  return signInWithEmailAndPassword(auth, email, password)
}

/**
 * Cierra la sesión activa del usuario en Firebase Auth.
 */
export const logoutUser = async (): Promise<void> => {
  return signOut(auth)
}

/**
 * Observa los cambios en el estado de autenticación (inicio, cierre de sesión o restauración de token).
 * Retorna la función `Unsubscribe` para limpiar el observador cuando sea necesario.
 */
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
): Unsubscribe => {
  return onAuthStateChanged(auth, callback)
}

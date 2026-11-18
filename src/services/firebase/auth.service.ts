import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import type { User, UserCredential, Unsubscribe } from 'firebase/auth'
import { auth } from './config'

/**
 * Registra un nuevo usuario utilizando correo electrónico y contraseña.
 */
export const registerUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password)
}

/**
 * Inicia sesión con correo electrónico y contraseña existentes.
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
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


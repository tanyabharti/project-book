import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  doc,
  getFirestore,
  setDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAX8BDoabroUvzDZHBxSs4N0UnoFDrEMUU',
  authDomain: 'project-book-c8317.firebaseapp.com',
  projectId: 'project-book-c8317',
  storageBucket: 'project-book-c8317.appspot.com',
  messagingSenderId: '907957375372',
  appId: '1:907957375372:web:e748bed8dfb0abf74586a9',
  measurementId: 'G-GLJ72M1432',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// User Profile Section

const updateUserDatabase = async (user, uid) => {
  if (typeof user !== 'object') return

  const docRef = doc(db, 'users', uid)
  await setDoc(docRef, { ...user, uid })
}

const fetchUserFromDatabase = async (uid) => {
  const docRef = doc(db, 'users', uid)
  const result = await getDoc(docRef)

  if (!result.exists()) return null
  return result.data()
}

// Projects Section
const addProjectInServer = async (project) => {
  if (typeof project !== 'object') return

  const collectionRef = collection(db, 'projects')
  await addDoc(collectionRef, { ...project })
}
const updateProjectInServer = async (project, pid) => {
  if (typeof project !== 'object') return

  const docRef = doc(db, 'projects', pid)
  await setDoc(docRef, { ...project })
}

const getAllProjects = async () => {
  return await getDocs(collection(db, 'projects'))
}

const getAllProjectsForUser = async (uid) => {
  if (!uid) return

  const collectionRef = collection(db, 'projects')
  const condition = where('refUser', '==', uid)
  const dbQuery = query(collectionRef, condition)

  return await getDocs(dbQuery)
}

const deleteProject = async (pid) => {
  const docRef = doc(db, 'projects', pid)
  await deleteDoc(docRef)
}

export {
  app as default,
  auth,
  db,
  updateUserDatabase,
  fetchUserFromDatabase,
  updateProjectInServer,
  addProjectInServer,
  deleteProject,
  getAllProjects,
  getAllProjectsForUser,
}

import { initializeApp } from '@firebase/app';
import { collection, doc, getDoc, getDocs, updateDoc, getFirestore, setDoc, deleteDoc } from '@firebase/firestore';
import { config } from './config.js';

// const config = {
//   // INSERT YOU FIREBASE APP CONFIG HERE
//   // CREATE AT https://console.firebase.google.com/
//   // Imported as config
// };

export const app = initializeApp(config);
export const db = getFirestore();

export const getSpec = async (path) => {
  const docRef = doc(db, path);
  const res = await getDoc(docRef);
  return res.data();
}

export const getSpecDocs = async (path) => {
  const collectionRef = collection(db, path);
  const res = await getDocs(collectionRef);
  return res;

  // res.forEach((doc) => {
  //   console.log(`${doc.id} => ${doc.data()}`);
  //   console.log(doc.data())
  // });
}

export const createSpec = async (path, values) => {
  const docRef = doc(db, path);
  await setDoc(docRef, values);
  const res = await getDoc(docRef);
  return res.data();
};

export const updateSpec = async (path, values) => {
  const docRef = doc(db, path);
  await updateDoc(docRef, values);
  const res = await getDoc(docRef);
  return res.data();
};

export const deleteSpec = async (path) => {
  const docRef = doc(db, path);
  await deleteDoc(docRef);
};
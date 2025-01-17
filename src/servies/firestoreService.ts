import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  CollectionReference,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";

const db = getFirestore(app);

class FirestoreService {
  // Method to get all documents from a collection
  static async getCollection(collectionName: string) {
    const colRef = collection(db, collectionName);
    const colSnapshot = await getDocs(colRef);
    const documents = colSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return documents;
  }

  // Method to get a document by ID from a collection
  static async getDocument(collectionName: string, documentId: string) {
    const docRef = doc(db, collectionName, documentId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      throw new Error(`Document with ID ${documentId} not found in collection ${collectionName}`);
    }
  }

  // Method to get all documents from a subcollection
  static async getSubcollection(
    collectionName: string,
    documentId: string,
    subcollectionName: string
  ) {
    const subColRef = collection(db, collectionName, documentId, subcollectionName);
    const subColSnapshot = await getDocs(subColRef);
    const subDocuments = subColSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return subDocuments;
  }
}

export default FirestoreService;

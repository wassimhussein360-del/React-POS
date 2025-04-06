import { getFirestore, collection, getDocs, doc, getDoc, onSnapshot } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { Observable } from "rxjs";

const db = getFirestore(app);

import {
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Query,
  DocumentData,
  WhereFilterOp,
  OrderByDirection,
  DocumentSnapshot,
} from "firebase/firestore";

type QueryCondition = {
  field: string;
  operator: WhereFilterOp;
  value: unknown;
};

type OrderByCondition = {
  field: string;
  direction?: OrderByDirection;
};

type QueryOptions = {
  whereConditions?: QueryCondition[];
  orderByConditions?: OrderByCondition[];
  limitNumber?: number;
  startAfterDocument?: DocumentSnapshot<DocumentData> | null;
};

class FirestoreService {
  // Generalized method for querying collections/subcollections
  static async queryCollection(pathSegments: [string, ...string[]], options: QueryOptions = {}) {
    try {
      const collectionRef = collection(db, ...pathSegments);
      let q: Query<DocumentData> = query(collectionRef);

      // Add WHERE conditions
      if (options.whereConditions) {
        options.whereConditions.forEach(({ field, operator, value }) => {
          q = query(q, where(field, operator, value));
        });
      }

      // Add ORDER BY conditions
      if (options.orderByConditions) {
        options.orderByConditions.forEach(({ field, direction }) => {
          q = query(q, orderBy(field, direction || "asc"));
        });
      }

      // Add LIMIT
      if (options.limitNumber) {
        q = query(q, limit(options.limitNumber));
      }

      // Add PAGINATION (startAfter)
      if (options.startAfterDocument) {
        q = query(q, startAfter(options.startAfterDocument));
      }

      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return documents;
    } catch (error: any) {
      throw new Error(`Query failed: ${error.message}`);
    }
  }

  // Updated getSubcollection method using queryCollection
  static async getSubcollection(
    collectionName: string,
    documentId: string,
    subcollectionName: string,
    options?: QueryOptions
  ) {
    return this.queryCollection([collectionName, documentId, subcollectionName], options);
  }

  // New method for querying top-level collections
  static async getCollection(collectionName: string, options?: QueryOptions) {
    return this.queryCollection([collectionName], options);
  }

  static async getDocument(collectionName: string, documentId: string) {
    const docRef = doc(db, collectionName, documentId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      throw new Error(`Document with ID ${documentId} not found in collection ${collectionName}`);
    }
  }

  static getObserveSubDocument(
    collectionName: string,
    documentId: string,
    subcollectionName: string,
    subdocumentId: string
  ): Observable<DocumentData | null> {
    return new Observable((observer) => {
      try {
        const docRef = doc(db, collectionName, documentId, subcollectionName, subdocumentId);

        const unsubscribe = onSnapshot(
          docRef,
          (docSnap) => {
            if (docSnap.exists()) {
              observer.next({
                id: docSnap.id,
                ...docSnap.data(),
              });
            } else {
              observer.next(null); // or observer.error(...) if preferred
            }
          },
          (error) => {
            observer.error(`Failed to observe document: ${error.message}`);
          }
        );

        // Cleanup function
        return () => unsubscribe();
      } catch (error: any) {
        observer.error(`Failed to observe document: ${error.message}`);
      }
    });
  }
}
export default FirestoreService;

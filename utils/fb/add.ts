import { getFirestore, doc, setDoc, getDoc, query, collection, orderBy, getDocs } from "firebase/firestore";

export const db = getFirestore(app);

export const addDocToFirestore = async (collectionNames: string[], data: object, docID: string) => {
  try {
    await setDoc(doc(db, collectionNames[0], ...collectionNames.slice(1), docID), {
      ...data,
    });
    return docID;
  } catch (error) {
    console.log(error);
    throw "Error adding document!";
  }
};

export const getRatings = async (storageArr: string[]) => {
  const q = await query(collection(db, storageArr[0], ...storageArr.slice(1)), orderBy("id"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

export const FStoJSON = async (storageArr: string[]) => {
  const q = await query(collection(db, storageArr[0], ...storageArr.slice(1)), orderBy("id"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

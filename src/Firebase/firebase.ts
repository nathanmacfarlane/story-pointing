import { message } from 'antd';
import firebase from 'firebase';
import { useEffect, useState } from 'react';

export enum Collection {
  Rooms = 'Rooms',
  Users = 'Users',
  Votes = 'Votes',
}

type FirebaseData = any;

export class Firebase {
  private static _instance: Firebase;
  private generateId() {
    return `${Math.floor(Math.random() * 899999 + 100000)}`;
  }
  public getApp() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyC2EBAmOPWUwTdCUWryxKmRgidP2BUplMU',
        authDomain: 'story-pointing-49861.firebaseapp.com',
        projectId: 'story-pointing-49861',
        storageBucket: 'story-pointing-49861.appspot.com',
        messagingSenderId: '691756506313',
        appId: '1:691756506313:web:eb3a0b7c62755b55f90118',
      });
      firebase.firestore().settings({
        ignoreUndefinedProperties: true,
      });
    } else {
      firebase.app();
    }
  }
  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
  public getFirestore() {
    const db = firebase.firestore();
    return db;
  }

  /**
   * Abstract helper for creating an object
   */
  public createObject(
    collection: Collection,
    payload: FirebaseData,
    callback?: (id: string) => void
  ) {
    const db = Firebase.Instance.getFirestore();
    const id = this.generateId();
    db.collection(collection)
      .doc(id)
      .set(payload)
      .then(() => {
        if (callback) {
          callback(id);
        }
      });
  }

  /**
   * Abstract helper for updating an object
   */
  public updateObject(
    collection: Collection,
    id: string,
    payload: FirebaseData,
    callback?: (id: string) => void
  ) {
    const db = Firebase.Instance.getFirestore();
    db.collection(collection)
      .doc(id)
      .set(payload)
      .then(() => {
        if (callback) {
          callback(id);
        }
      });
  }

  /**
   * Abstract helper for listening to an object
   */
  public listenToObject(
    collection: Collection,
    id: string,
    callback: (data: FirebaseData) => void
  ) {
    const db = Firebase.Instance.getFirestore();
    db.collection(collection)
      .doc(id)
      .onSnapshot((doc) => {
        if (doc.exists) {
          callback({ ...doc.data(), id });
        }
      });
  }

  /**
   * Abstract helper for fetching an object
   */
  public fetchObject(
    collection: Collection,
    id: string,
    callback: (data: FirebaseData) => void
  ) {
    const db = Firebase.Instance.getFirestore();
    db.collection(collection)
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          callback(doc.data());
        }
      });
  }

  /**
   * Abstract helper for fetching an object
   */
  public async fetchObjectAsync(collection: Collection, id: string) {
    const db = Firebase.Instance.getFirestore();
    const doc = await db.collection(collection).doc(id).get();
    return { ...doc.data(), id: doc.id };
  }

  /**
   * Creates a Room
   */
  public createRoom(
    epicName: string,
    storyNames: string[],
    userIds: string[],
    adminId?: string,
    callback?: (roomId: string) => void
  ) {
    this.createObject(
      Collection.Rooms,
      {
        epicName,
        storyNames,
        userIds,
        adminId,
        activePage: 'EPIC',
        timestamp: firebase.firestore.Timestamp.now(),
      },
      callback
    );
  }

  /**
   * Creates a Room
   */
  public addUserToRoom(
    roomId: string,
    userId: string,
    callback?: (roomId: string) => void
  ) {
    this.fetchObject(Collection.Rooms, roomId, (room) => {
      const db = Firebase.Instance.getFirestore();
      const existingUserIds: string[] = room['userIds'] || [];
      const newUserIds = [...existingUserIds, userId];
      const update: any = { userIds: newUserIds };
      if (!room.adminId) {
        update.adminId = userId;
      }
      db.collection(Collection.Rooms)
        .doc(roomId)
        .update(update)
        .then((response) => {
          if (callback) {
            callback(roomId);
          }
        });
    });
  }

  /**
   * Creates a User
   */
  public createUser(
    name: string,
    emoji: string,
    skinTone: number,
    callback?: (userId: string) => void
  ) {
    const payload = {
      name,
      emoji,
      skinTone,
    };
    const db = Firebase.Instance.getFirestore();
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        const user = firebase.auth().currentUser;
        const userId = user?.uid;
        if (userId) {
          db.collection(Collection.Users)
            .doc(userId)
            .set(payload)
            .then(() => {
              if (callback) {
                callback(userId);
              }
            });
        } else {
          message.error('Unable to create a user.');
        }
      });
  }

  /**
   * Creates a Vote
   */
  public createVote(
    userId: string,
    roomId: string,
    storyName: string,
    value: number,
    callback?: (voteId: string) => void
  ) {
    const payload = {
      userId,
      roomId,
      storyName,
      value,
    };
    const db = Firebase.Instance.getFirestore();
    db.collection(Collection.Votes)
      .where('roomId', '==', roomId)
      .where('userId', '==', userId)
      .where('storyName', '==', storyName)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size == 0) {
          // user hasn't voted on this story yet. Allow Vote.
          this.createObject(Collection.Votes, payload, callback);
        } else {
          // user has already voted on this story. Update Vote.
          const data = querySnapshot.docs[0];
          const updatedData = { ...data, value };
          this.updateObject(Collection.Votes, data.id, payload, callback);
        }
      });
  }

  /**
   * Listens to a Room
   */
  public listenToRoom(roomId: string, callback: (data: FirebaseData) => void) {
    this.listenToObject(Collection.Rooms, roomId, callback);
  }

  /**
   * Check if Room Exists
   */
  public roomExists(roomId: string, callback: (exists: boolean) => void) {
    const db = Firebase.Instance.getFirestore();
    db.collection(Collection.Rooms)
      .doc(roomId)
      .get()
      .then((doc) => callback(doc.exists));
  }

  /**
   * Fetch a User
   */
  public fetchUser(userId: string, callback: (data: FirebaseData) => void) {
    this.fetchObject(Collection.Users, userId, callback);
  }

  /**
   * Listens to Votes
   */
  public listenToVotes(
    roomId: string,
    callback: (data: FirebaseData[]) => void
  ) {
    const db = Firebase.Instance.getFirestore();
    db.collection(Collection.Votes)
      .where('roomId', '==', roomId)
      .get()
      .then((querySnapshot) => {
        let result: any[] = [];
        querySnapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() });
        });
        callback(result);
      });
  }

  /**
   * Sets Active Page
   */
  public setActivePage(
    roomId: string,
    activePage: 'EPIC' | 'POKER' | 'SUMMARY',
    activeStory?: string,
    callback?: (id: string) => void
  ) {
    const db = Firebase.Instance.getFirestore();
    db.collection(Collection.Rooms)
      .doc(roomId)
      .update({ activePage, activeStory })
      .then(() => {
        if (callback) {
          callback(roomId);
        }
      });
  }

  /*
   * Helper to finding rooms that user is in
   */
  public fetchUsersActiveRooms(userId: string, callback: (data: any) => void) {
    const db = Firebase.Instance.getFirestore();
    db.collection(Collection.Rooms)
      .where('userIds', 'array-contains', userId)
      .get()
      .then((querySnapshot) => {
        let result: any[] = [];
        querySnapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() });
        });
        callback(result);
      });
  }

  /**
   * Listen to votes on a room's story
   */
  public listenToVotesOnRoomsStory(
    roomId: string,
    storyName: string,
    callback: (data: FirebaseData[]) => void
  ) {
    const db = Firebase.Instance.getFirestore();
    db.collection(Collection.Votes)
      .where('roomId', '==', roomId)
      .where('storyName', '==', storyName)
      .onSnapshot((querySnapshot) => {
        let result: any[] = [];
        querySnapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() });
        });
        callback(result);
      });
  }

  /*
   * Fetch multiple users with callback
   */
  public fetchUsers(
    userIds: string[],
    callback: (data: FirebaseData[]) => void
  ) {
    const store = new Firebase();
    if (userIds) {
      const promises: Promise<any>[] = [];
      for (const userId of userIds) {
        const promise = store.fetchObjectAsync(Collection.Users, userId);
        promises.push(promise);
      }
      Promise.all(promises).then((data) => callback(data));
    }
  }
}

/**
 * Hook for listening to a room
 */
export const useListenToRoom = (roomId?: string) => {
  const store = new Firebase();
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (roomId) {
      store.listenToRoom(roomId, (response) => setData(response));
    }
  }, [roomId]);

  return { room: data };
};

/**
 * Hook for fetching users
 */
export const useFetchUsers = (userIds?: string[]) => {
  const store = new Firebase();
  const [data, setData] = useState<any>();
  useEffect(() => {
    if (userIds) {
      const promises: Promise<any>[] = [];
      for (const userId of userIds) {
        const promise = store.fetchObjectAsync(Collection.Users, userId);
        promises.push(promise);
      }
      Promise.all(promises).then(setData);
    }
  }, [userIds]);

  return { users: data };
};

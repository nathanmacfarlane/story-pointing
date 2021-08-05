import firebase from 'firebase';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Firebase, useListenToRoom } from '../Firebase/firebase';

export const useRedirectToLanding = () => {
  // init app
  Firebase.Instance.getApp();
  const { push } = useHistory();
  useEffect(() => {
    const userId = firebase.auth().currentUser?.uid;
    if (!userId) {
      push('/');
    }
  }, []);
};

export const useIsAdmin = (roomId?: string) => {
  Firebase.Instance.getApp();
  const userId = firebase.auth().currentUser?.uid;
  const { room } = useListenToRoom(roomId);
  const isAdmin = room?.adminId === userId;

  return { isAdmin };
};

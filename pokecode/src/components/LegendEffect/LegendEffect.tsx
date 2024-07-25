import React, { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';

const FullScreenEffect = ({ person, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3초 동안 이펙트 표시

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="full-screen-effect">
      <h2>{person}님이 입장하셨습니다!</h2>
      {/* 여기에 원하는 특수 이펙트를 추가하세요 */}
    </div>
  );
};

const usePersonQueue = () => {
  const [isEffectActive, setIsEffectActive] = useState(false);
  const [currentPerson, setCurrentPerson] = useState('');
  const queueRef = useRef([]);
  const isProcessingRef = useRef(false);

  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      isProcessingRef.current = false;
      return;
    }

    isProcessingRef.current = true;
    const person = queueRef.current.shift();
    setCurrentPerson(person);
    setIsEffectActive(true);
  }, []);

  const addToQueue = useCallback(
    (person) => {
      queueRef.current.push(person);
      if (!isProcessingRef.current) {
        processQueue();
      }
    },
    [processQueue]
  );

  const completeEffect = useCallback(() => {
    setIsEffectActive(false);
    setTimeout(processQueue, 500); // 이펙트 사이의 짧은 지연
  }, [processQueue]);

  return { isEffectActive, currentPerson, addToQueue, completeEffect };
};

const PersonEntryEffects = () => {
  const { isEffectActive, currentPerson, addToQueue, completeEffect } =
    usePersonQueue();
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://your-server-url'); // 실제 서버 URL로 변경하세요

    socketRef.current.on('personEntered', (person) => {
      addToQueue(person);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [addToQueue]);

  return (
    <>
      {isEffectActive && (
        <FullScreenEffect person={currentPerson} onComplete={completeEffect} />
      )}
    </>
  );
};

export default PersonEntryEffects;

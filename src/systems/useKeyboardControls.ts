import { useEffect, useRef } from 'react';
import { inputManager } from './inputManager';

export interface MovementInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export function useKeyboardControls() {
  const movementRef = useRef<MovementInput>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture movement if user is typing in a form or input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      const key = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';

      const isForward = code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'arrowup';
      const isBackward = code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown';
      const isLeft = code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'arrowleft';
      const isRight = code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'arrowright';

      if (isForward || isBackward || isLeft || isRight) {
        // Prevent default browser scrolling on arrow keys
        e.preventDefault();
      }

      if (isForward) {
        movementRef.current.forward = true;
        inputManager.setKeyboardKey('forward', true);
      }
      if (isBackward) {
        movementRef.current.backward = true;
        inputManager.setKeyboardKey('backward', true);
      }
      if (isLeft) {
        movementRef.current.left = true;
        inputManager.setKeyboardKey('left', true);
      }
      if (isRight) {
        movementRef.current.right = true;
        inputManager.setKeyboardKey('right', true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';

      const isForward = code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'arrowup';
      const isBackward = code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown';
      const isLeft = code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'arrowleft';
      const isRight = code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'arrowright';

      if (isForward) {
        movementRef.current.forward = false;
        inputManager.setKeyboardKey('forward', false);
      }
      if (isBackward) {
        movementRef.current.backward = false;
        inputManager.setKeyboardKey('backward', false);
      }
      if (isLeft) {
        movementRef.current.left = false;
        inputManager.setKeyboardKey('left', false);
      }
      if (isRight) {
        movementRef.current.right = false;
        inputManager.setKeyboardKey('right', false);
      }
    };

    const handleBlur = () => {
      movementRef.current.forward = false;
      movementRef.current.backward = false;
      movementRef.current.left = false;
      movementRef.current.right = false;
      inputManager.resetKeyboard();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return movementRef;
}

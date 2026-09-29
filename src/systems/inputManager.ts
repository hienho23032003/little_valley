export interface MovementVector {
  x: number; // -1.0 (left) to +1.0 (right)
  y: number; // -1.0 (backward) to +1.0 (forward)
}

// Module-level mutable input state to ensure ZERO per-frame memory allocations
const keyboardState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

const joystickState = {
  x: 0,
  y: 0,
  active: false,
};

let currentCameraAngle = 0;

// Reusable output vector to avoid allocating objects inside useFrame
const combinedVector: MovementVector = { x: 0, y: 0 };

export const inputManager = {
  setCameraAngle(angle: number) {
    currentCameraAngle = angle;
  },

  getCameraAngle(): number {
    return currentCameraAngle;
  },

  setKeyboardKey(key: 'forward' | 'backward' | 'left' | 'right', pressed: boolean) {
    keyboardState[key] = pressed;
  },

  resetKeyboard() {
    keyboardState.forward = false;
    keyboardState.backward = false;
    keyboardState.left = false;
    keyboardState.right = false;
  },

  setJoystickVector(x: number, y: number, active: boolean) {
    joystickState.x = x;
    joystickState.y = y;
    joystickState.active = active;
  },

  /**
   * Returns current combined movement vector from Keyboard and Joystick.
   * Frame-rate independent and produces zero GC allocations.
   */
  getCombinedInput(): MovementVector {
    let kx = 0;
    let ky = 0;

    // 1. Keyboard input
    if (keyboardState.forward) ky += 1;
    if (keyboardState.backward) ky -= 1;
    if (keyboardState.left) kx -= 1;
    if (keyboardState.right) kx += 1;

    // 2. If Joystick is actively being used, it takes precedence
    if (joystickState.active && (joystickState.x !== 0 || joystickState.y !== 0)) {
      combinedVector.x = joystickState.x;
      combinedVector.y = joystickState.y;
    } else if (kx !== 0 || ky !== 0) {
      // Normalize keyboard diagonal movement so diagonal isn't sqrt(2) faster
      const len = Math.hypot(kx, ky);
      combinedVector.x = kx / len;
      combinedVector.y = ky / len;
    } else {
      combinedVector.x = 0;
      combinedVector.y = 0;
    }

    return combinedVector;
  },

  isMoving(): boolean {
    return (
      (joystickState.active && (joystickState.x !== 0 || joystickState.y !== 0)) ||
      keyboardState.forward ||
      keyboardState.backward ||
      keyboardState.left ||
      keyboardState.right
    );
  },
};

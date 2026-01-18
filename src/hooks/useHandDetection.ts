import { useState, useEffect, useRef, useCallback } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs';

// Landmark indices for hand
const LANDMARK = {
  WRIST: 0,
  THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_MCP: 5, INDEX_PIP: 6, INDEX_DIP: 7, INDEX_TIP: 8,
  MIDDLE_MCP: 9, MIDDLE_PIP: 10, MIDDLE_DIP: 11, MIDDLE_TIP: 12,
  RING_MCP: 13, RING_PIP: 14, RING_DIP: 15, RING_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20
};

// ============= HELPER FUNCTIONS =============

const distance = (p1: number[], p2: number[]): number => {
  return Math.sqrt(
    Math.pow(p1[0] - p2[0], 2) + 
    Math.pow(p1[1] - p2[1], 2) + 
    Math.pow(p1[2] - p2[2], 2)
  );
};

const distance2D = (p1: number[], p2: number[]): number => {
  return Math.sqrt(
    Math.pow(p1[0] - p2[0], 2) + 
    Math.pow(p1[1] - p2[1], 2)
  );
};

const isFingerExtended = (landmarks: number[][], mcp: number, pip: number, dip: number, tip: number): boolean => {
  const mcpToPip = distance(landmarks[mcp], landmarks[pip]);
  const pipToTip = distance(landmarks[pip], landmarks[tip]);
  const mcpToTip = distance(landmarks[mcp], landmarks[tip]);
  
  return mcpToTip > (mcpToPip + pipToTip) * 0.7;
};

const isFingerCurled = (landmarks: number[][], mcp: number, pip: number, dip: number, tip: number): boolean => {
  const mcpToTip = distance(landmarks[mcp], landmarks[tip]);
  const mcpToPip = distance(landmarks[mcp], landmarks[pip]);
  
  return mcpToTip < mcpToPip * 1.5;
};

const isFingerTightlyCurled = (landmarks: number[][], mcp: number, pip: number, dip: number, tip: number): boolean => {
  const mcpToTip = distance(landmarks[mcp], landmarks[tip]);
  const mcpToPip = distance(landmarks[mcp], landmarks[pip]);
  
  return mcpToTip < mcpToPip * 1.2;
};

const isThumbExtended = (landmarks: number[][]): boolean => {
  const thumbTip = landmarks[LANDMARK.THUMB_TIP];
  const thumbMcp = landmarks[LANDMARK.THUMB_MCP];
  const indexMcp = landmarks[LANDMARK.INDEX_MCP];
  
  const thumbLength = distance(thumbMcp, thumbTip);
  const thumbToIndex = distance(thumbTip, indexMcp);
  
  return thumbToIndex > thumbLength * 0.8;
};

const getFingerStates = (landmarks: number[][]): {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
} => {
  return {
    thumb: isThumbExtended(landmarks),
    index: isFingerExtended(landmarks, LANDMARK.INDEX_MCP, LANDMARK.INDEX_PIP, LANDMARK.INDEX_DIP, LANDMARK.INDEX_TIP),
    middle: isFingerExtended(landmarks, LANDMARK.MIDDLE_MCP, LANDMARK.MIDDLE_PIP, LANDMARK.MIDDLE_DIP, LANDMARK.MIDDLE_TIP),
    ring: isFingerExtended(landmarks, LANDMARK.RING_MCP, LANDMARK.RING_PIP, LANDMARK.RING_DIP, LANDMARK.RING_TIP),
    pinky: isFingerExtended(landmarks, LANDMARK.PINKY_MCP, LANDMARK.PINKY_PIP, LANDMARK.PINKY_DIP, LANDMARK.PINKY_TIP)
  };
};

// ============= DIRECTIONAL HELPERS =============

const isIndexPointingUp = (landmarks: number[][]): boolean => {
  const indexTip = landmarks[LANDMARK.INDEX_TIP];
  const indexMcp = landmarks[LANDMARK.INDEX_MCP];
  return indexTip[1] < indexMcp[1]; // Y decreases going up
};

const isIndexPointingSideways = (landmarks: number[][]): boolean => {
  const indexTip = landmarks[LANDMARK.INDEX_TIP];
  const indexMcp = landmarks[LANDMARK.INDEX_MCP];
  const dx = Math.abs(indexTip[0] - indexMcp[0]);
  const dy = Math.abs(indexTip[1] - indexMcp[1]);
  return dx > dy * 1.5;
};

const isHandPointingDown = (landmarks: number[][]): boolean => {
  const wrist = landmarks[LANDMARK.WRIST];
  const middleTip = landmarks[LANDMARK.MIDDLE_TIP];
  return middleTip[1] > wrist[1] + 30; // Y increases going down
};

const isThumbBetweenFingers = (landmarks: number[][]): boolean => {
  const thumbTip = landmarks[LANDMARK.THUMB_TIP];
  const indexMcp = landmarks[LANDMARK.INDEX_MCP];
  const middleMcp = landmarks[LANDMARK.MIDDLE_MCP];
  
  const thumbToIndex = distance(thumbTip, indexMcp);
  const thumbToMiddle = distance(thumbTip, middleMcp);
  
  return thumbToIndex < 50 && thumbToMiddle < 50;
};

const areFingersTouching = (landmarks: number[][], tip1: number, tip2: number): boolean => {
  return distance(landmarks[tip1], landmarks[tip2]) < 40;
};

const areFingersCrossed = (landmarks: number[][]): boolean => {
  const indexTip = landmarks[LANDMARK.INDEX_TIP];
  const middleTip = landmarks[LANDMARK.MIDDLE_TIP];
  const indexMcp = landmarks[LANDMARK.INDEX_MCP];
  const middleMcp = landmarks[LANDMARK.MIDDLE_MCP];
  
  // R has fingers crossed - middle tip is closer to index side
  const middleToIndexMcp = distance(middleTip, indexMcp);
  const indexToMiddleMcp = distance(indexTip, middleMcp);
  
  return middleToIndexMcp < indexToMiddleMcp * 0.9;
};

// ============= CONFIDENCE CALCULATION =============

interface FingerMatch {
  expected: boolean;
  actual: boolean;
}

const calculateConfidence = (
  fingerMatches: FingerMatch[],
  additionalChecks: boolean[] = []
): number => {
  let score = 0;
  const fingerWeight = 15; // Each finger contributes 15%
  const additionalWeight = 25 / Math.max(additionalChecks.length, 1); // Additional checks share 25%
  
  // Score for finger states
  for (const match of fingerMatches) {
    if (match.expected === match.actual) {
      score += fingerWeight;
    }
  }
  
  // Score for additional geometric checks
  for (const check of additionalChecks) {
    if (check) {
      score += additionalWeight;
    }
  }
  
  return Math.min(score, 100);
};

// ============= ASL LETTER RECOGNITION =============

const recognizeASLLetter = (landmarks: number[][]): { letter: string; confidence: number } | null => {
  const fingers = getFingerStates(landmarks);
  const extendedCount = [fingers.index, fingers.middle, fingers.ring, fingers.pinky].filter(Boolean).length;
  
  const thumbTip = landmarks[LANDMARK.THUMB_TIP];
  const indexTip = landmarks[LANDMARK.INDEX_TIP];
  const middleTip = landmarks[LANDMARK.MIDDLE_TIP];
  const ringTip = landmarks[LANDMARK.RING_TIP];
  const pinkyTip = landmarks[LANDMARK.PINKY_TIP];
  const wrist = landmarks[LANDMARK.WRIST];
  
  const thumbIndexDist = distance(thumbTip, indexTip);
  const indexMiddleDist = distance(indexTip, middleTip);
  
  // ============= PRIORITY 1: VERY DISTINCTIVE SIGNS =============
  
  // Y - Thumb and pinky extended, others curled (shaka sign)
  if (fingers.thumb && fingers.pinky && !fingers.index && !fingers.middle && !fingers.ring) {
    const conf = calculateConfidence([
      { expected: true, actual: fingers.thumb },
      { expected: true, actual: fingers.pinky },
      { expected: false, actual: fingers.index },
      { expected: false, actual: fingers.middle },
      { expected: false, actual: fingers.ring }
    ]);
    return { letter: 'Y', confidence: conf };
  }
  
  // I - Only pinky extended (very distinctive)
  if (fingers.pinky && !fingers.index && !fingers.middle && !fingers.ring && !fingers.thumb) {
    const conf = calculateConfidence([
      { expected: true, actual: fingers.pinky },
      { expected: false, actual: fingers.index },
      { expected: false, actual: fingers.middle },
      { expected: false, actual: fingers.ring },
      { expected: false, actual: fingers.thumb }
    ]);
    return { letter: 'I', confidence: conf };
  }
  
  // ============= PRIORITY 2: L AND G (thumb + index) =============
  
  // L - Thumb and index extended at 90 degrees, pointing up
  if (fingers.thumb && fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    if (isIndexPointingUp(landmarks)) {
      const conf = calculateConfidence([
        { expected: true, actual: fingers.thumb },
        { expected: true, actual: fingers.index },
        { expected: false, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky }
      ], [isIndexPointingUp(landmarks)]);
      return { letter: 'L', confidence: conf };
    }
    
    // G - Index and thumb pointing sideways
    if (isIndexPointingSideways(landmarks)) {
      const conf = calculateConfidence([
        { expected: true, actual: fingers.thumb },
        { expected: true, actual: fingers.index },
        { expected: false, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky }
      ], [isIndexPointingSideways(landmarks)]);
      return { letter: 'G', confidence: conf };
    }
  }
  
  // Q - Like G but pointing downward
  if (fingers.thumb && fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    if (isHandPointingDown(landmarks)) {
      const conf = calculateConfidence([
        { expected: true, actual: fingers.thumb },
        { expected: true, actual: fingers.index },
        { expected: false, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky }
      ], [isHandPointingDown(landmarks)]);
      return { letter: 'Q', confidence: conf };
    }
  }
  
  // ============= PRIORITY 3: SINGLE FINGER POINTING =============
  
  // D - Only index extended pointing up
  if (fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && isIndexPointingUp(landmarks)) {
    const conf = calculateConfidence([
      { expected: true, actual: fingers.index },
      { expected: false, actual: fingers.middle },
      { expected: false, actual: fingers.ring },
      { expected: false, actual: fingers.pinky }
    ], [isIndexPointingUp(landmarks)]);
    return { letter: 'D', confidence: conf };
  }
  
  // ============= PRIORITY 4: THREE FINGERS =============
  
  // W - Index, middle, ring extended, pinky curled
  if (fingers.index && fingers.middle && fingers.ring && !fingers.pinky && !fingers.thumb) {
    const conf = calculateConfidence([
      { expected: true, actual: fingers.index },
      { expected: true, actual: fingers.middle },
      { expected: true, actual: fingers.ring },
      { expected: false, actual: fingers.pinky },
      { expected: false, actual: fingers.thumb }
    ]);
    return { letter: 'W', confidence: conf };
  }
  
  // ============= PRIORITY 5: K (thumb between fingers) =============
  
  // K - Index and middle extended, thumb between them, ring + pinky curled
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    if (isThumbBetweenFingers(landmarks) && isIndexPointingUp(landmarks)) {
      const conf = calculateConfidence([
        { expected: true, actual: fingers.index },
        { expected: true, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky }
      ], [isThumbBetweenFingers(landmarks), isIndexPointingUp(landmarks)]);
      return { letter: 'K', confidence: conf };
    }
  }
  
  // P - Like K but hand pointing downward
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    if (isThumbBetweenFingers(landmarks) && isHandPointingDown(landmarks)) {
      const conf = calculateConfidence([
        { expected: true, actual: fingers.index },
        { expected: true, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky }
      ], [isThumbBetweenFingers(landmarks), isHandPointingDown(landmarks)]);
      return { letter: 'P', confidence: conf };
    }
  }
  
  // ============= PRIORITY 6: F (thumb-index touching) =============
  
  // F - Middle, ring, pinky extended; index and thumb touching
  if (!fingers.index && fingers.middle && fingers.ring && fingers.pinky) {
    if (thumbIndexDist < 50) {
      const conf = calculateConfidence([
        { expected: false, actual: fingers.index },
        { expected: true, actual: fingers.middle },
        { expected: true, actual: fingers.ring },
        { expected: true, actual: fingers.pinky }
      ], [thumbIndexDist < 50]);
      return { letter: 'F', confidence: conf };
    }
  }
  
  // ============= PRIORITY 7: TWO FINGER SIGNS (V, U, H, R) =============
  
  // R - Index and middle extended and CROSSED (check first - most distinctive)
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    if (areFingersCrossed(landmarks)) {
      const conf = calculateConfidence([
        { expected: true, actual: fingers.index },
        { expected: true, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky }
      ], [areFingersCrossed(landmarks)]);
      return { letter: 'R', confidence: conf };
    }
  }
  
  // V - Index and middle extended and SPREAD apart
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    if (indexMiddleDist > 50 && isIndexPointingUp(landmarks)) {
      const conf = calculateConfidence([
        { expected: true, actual: fingers.index },
        { expected: true, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky }
      ], [indexMiddleDist > 50, isIndexPointingUp(landmarks)]);
      return { letter: 'V', confidence: conf };
    }
  }
  
  // H - Index and middle extended together, pointing SIDEWAYS
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    if (isIndexPointingSideways(landmarks) && indexMiddleDist < 45) {
      const conf = calculateConfidence([
        { expected: true, actual: fingers.index },
        { expected: true, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky }
      ], [isIndexPointingSideways(landmarks), indexMiddleDist < 45]);
      return { letter: 'H', confidence: conf };
    }
  }
  
  // U - Index and middle extended TOGETHER, pointing UP
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    if (indexMiddleDist < 45 && isIndexPointingUp(landmarks)) {
      const conf = calculateConfidence([
        { expected: true, actual: fingers.index },
        { expected: true, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky }
      ], [indexMiddleDist < 45, isIndexPointingUp(landmarks)]);
      return { letter: 'U', confidence: conf };
    }
  }
  
  // ============= PRIORITY 8: FOUR FINGERS =============
  
  // B - All four fingers extended, thumb tucked
  if (fingers.index && fingers.middle && fingers.ring && fingers.pinky && !fingers.thumb) {
    const conf = calculateConfidence([
      { expected: true, actual: fingers.index },
      { expected: true, actual: fingers.middle },
      { expected: true, actual: fingers.ring },
      { expected: true, actual: fingers.pinky },
      { expected: false, actual: fingers.thumb }
    ]);
    return { letter: 'B', confidence: conf };
  }
  
  // ============= PRIORITY 9: CURVED/CIRCLE SHAPES =============
  
  // C - All fingers curved (half-curled) forming a C shape
  const indexCurved = !fingers.index && !isFingerTightlyCurled(landmarks, LANDMARK.INDEX_MCP, LANDMARK.INDEX_PIP, LANDMARK.INDEX_DIP, LANDMARK.INDEX_TIP);
  const middleCurved = !fingers.middle && !isFingerTightlyCurled(landmarks, LANDMARK.MIDDLE_MCP, LANDMARK.MIDDLE_PIP, LANDMARK.MIDDLE_DIP, LANDMARK.MIDDLE_TIP);
  if (indexCurved && middleCurved && extendedCount === 0) {
    const thumbToFingers = distance(thumbTip, indexTip);
    if (thumbToFingers > 60 && thumbToFingers < 150) {
      const conf = calculateConfidence([
        { expected: false, actual: fingers.index },
        { expected: false, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky }
      ], [thumbToFingers > 60, thumbToFingers < 150]);
      return { letter: 'C', confidence: conf };
    }
  }
  
  // O - All fingers curved touching thumb to form circle
  if (extendedCount === 0) {
    const thumbToIndex = distance(thumbTip, indexTip);
    const thumbToMiddle = distance(thumbTip, middleTip);
    if (thumbToIndex < 50 && thumbToMiddle < 60) {
      const conf = calculateConfidence([
        { expected: false, actual: fingers.index },
        { expected: false, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky }
      ], [thumbToIndex < 50, thumbToMiddle < 60]);
      return { letter: 'O', confidence: conf };
    }
  }
  
  // ============= PRIORITY 10: FIST VARIATIONS =============
  // Order matters! Check most distinctive first.
  
  // All fist signs share this base condition
  const allFingersCurled = !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky;
  
  if (allFingersCurled) {
    const indexPip = landmarks[LANDMARK.INDEX_PIP];
    const indexDip = landmarks[LANDMARK.INDEX_DIP];
    const indexTipToWrist = distance(indexTip, wrist);
    const indexPipToWrist = distance(indexPip, wrist);
    const indexDipToWrist = distance(indexDip, wrist);
    
    const thumbToIndex = distance(thumbTip, indexTip);
    const thumbToMiddle = distance(thumbTip, middleTip);
    const thumbToRing = distance(thumbTip, ringTip);
    const thumbToPinky = distance(thumbTip, pinkyTip);
    const thumbToIndexMcp = distance(thumbTip, landmarks[LANDMARK.INDEX_MCP]);
    const thumbToMiddleMcp = distance(thumbTip, landmarks[LANDMARK.MIDDLE_MCP]);
    const thumbToWrist = distance(thumbTip, wrist);
    const indexMcpToWrist = distance(landmarks[LANDMARK.INDEX_MCP], wrist);
    
    const indexTightCurled = isFingerTightlyCurled(landmarks, LANDMARK.INDEX_MCP, LANDMARK.INDEX_PIP, LANDMARK.INDEX_DIP, LANDMARK.INDEX_TIP);
    const middleTightCurled = isFingerTightlyCurled(landmarks, LANDMARK.MIDDLE_MCP, LANDMARK.MIDDLE_PIP, LANDMARK.MIDDLE_DIP, LANDMARK.MIDDLE_TIP);
    const ringTightCurled = isFingerTightlyCurled(landmarks, LANDMARK.RING_MCP, LANDMARK.RING_PIP, LANDMARK.RING_DIP, LANDMARK.RING_TIP);
    
    // X - Index finger bent/hooked (tip curled back toward palm, but DIP is raised)
    // Distinctive: index finger makes a hook shape
    if (indexTipToWrist < indexPipToWrist && indexDipToWrist > indexTipToWrist * 0.9) {
      const conf = calculateConfidence([
        { expected: false, actual: fingers.index },
        { expected: false, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky }
      ], [indexTipToWrist < indexPipToWrist, indexDipToWrist > indexTipToWrist * 0.9]);
      return { letter: 'X', confidence: conf };
    }
    
    // T - Thumb tucked between index and middle (thumb tip near both MCPs but away from fingertips)
    if (thumbToIndexMcp < 40 && thumbToMiddleMcp < 50 && thumbToIndex > 35 && thumbToMiddle > 35) {
      const conf = calculateConfidence([
        { expected: false, actual: fingers.index },
        { expected: false, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky }
      ], [thumbToIndexMcp < 40, thumbToMiddleMcp < 50]);
      return { letter: 'T', confidence: conf };
    }
    
    // M - Three fingers (index, middle, ring) curled over thumb
    // Thumb tip should be visible near ring finger area
    if (indexTightCurled && middleTightCurled && ringTightCurled) {
      // Thumb is under fingers, tip near ring/pinky area
      if (thumbToRing < 55 && thumbToMiddle > 40 && thumbToIndex > 50) {
        const conf = calculateConfidence([
          { expected: false, actual: fingers.index },
          { expected: false, actual: fingers.middle },
          { expected: false, actual: fingers.ring },
          { expected: false, actual: fingers.pinky }
        ], [thumbToRing < 55, thumbToMiddle > 40]);
        return { letter: 'M', confidence: conf };
      }
    }
    
    // N - Two fingers (index, middle) curled over thumb
    // Thumb tip visible between middle and ring
    if (indexTightCurled && middleTightCurled) {
      if (thumbToMiddle < 45 && thumbToRing > 50 && thumbToIndex > 40) {
        const conf = calculateConfidence([
          { expected: false, actual: fingers.index },
          { expected: false, actual: fingers.middle },
          { expected: false, actual: fingers.ring },
          { expected: false, actual: fingers.pinky }
        ], [thumbToMiddle < 45, thumbToRing > 50]);
        return { letter: 'N', confidence: conf };
      }
    }
    
    // A - Fist with thumb alongside (thumb extended to the side)
    if (fingers.thumb && thumbToWrist > indexMcpToWrist * 0.75) {
      const conf = calculateConfidence([
        { expected: false, actual: fingers.index },
        { expected: false, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky },
        { expected: true, actual: fingers.thumb }
      ]);
      return { letter: 'A', confidence: conf };
    }
    
    // S - Fist with thumb wrapped over fingers (thumb not extended)
    if (!fingers.thumb) {
      // Check thumb is curled over fingers (close to index/middle area)
      if (thumbToIndex < 60 && thumbToMiddle < 70) {
        const conf = calculateConfidence([
          { expected: false, actual: fingers.index },
          { expected: false, actual: fingers.middle },
          { expected: false, actual: fingers.ring },
          { expected: false, actual: fingers.pinky },
          { expected: false, actual: fingers.thumb }
        ], [thumbToIndex < 60]);
        return { letter: 'S', confidence: conf };
      }
    }
    
    // E - Fingers curled with tips touching thumb (more closed than S)
    if (thumbToIndex < 50 && thumbToMiddle < 55 && thumbToRing < 60) {
      const conf = calculateConfidence([
        { expected: false, actual: fingers.index },
        { expected: false, actual: fingers.middle },
        { expected: false, actual: fingers.ring },
        { expected: false, actual: fingers.pinky }
      ], [thumbToIndex < 50, thumbToMiddle < 55]);
      return { letter: 'E', confidence: conf };
    }
  }
  
  return null;
};

// ============= HOOK IMPLEMENTATION =============

interface UseHandDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isEnabled: boolean;
}

interface UseHandDetectionReturn {
  isModelLoading: boolean;
  isModelLoaded: boolean;
  handDetected: boolean;
  currentGesture: string | null;
  confidence: number;
  landmarks: number[][] | null;
}

export const useHandDetection = ({
  videoRef,
  canvasRef,
  isEnabled,
}: UseHandDetectionProps): UseHandDetectionReturn => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [landmarks, setLandmarks] = useState<number[][] | null>(null);

  const modelRef = useRef<handpose.HandPose | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastDetectionRef = useRef<number>(0);
  const gestureHistoryRef = useRef<string[]>([]);

  // Load the model
  useEffect(() => {
    const loadModel = async () => {
      if (modelRef.current || isModelLoading) return;

      setIsModelLoading(true);
      try {
        console.log('Loading HandPose model...');
        const model = await handpose.load();
        modelRef.current = model;
        setIsModelLoaded(true);
        console.log('HandPose model loaded successfully!');
      } catch (error) {
        console.error('Error loading HandPose model:', error);
      } finally {
        setIsModelLoading(false);
      }
    };

    if (isEnabled) {
      loadModel();
    }
  }, [isEnabled, isModelLoading]);

  // Detection loop
  const detect = useCallback(async () => {
    if (
      !modelRef.current ||
      !videoRef.current ||
      !isEnabled ||
      videoRef.current.readyState !== 4
    ) {
      animationFrameRef.current = requestAnimationFrame(detect);
      return;
    }

    const now = Date.now();
    // Throttle detection to ~8 FPS for stability
    if (now - lastDetectionRef.current < 125) {
      animationFrameRef.current = requestAnimationFrame(detect);
      return;
    }
    lastDetectionRef.current = now;

    try {
      const predictions = await modelRef.current.estimateHands(videoRef.current);

      if (predictions.length > 0) {
        setHandDetected(true);
        const hand = predictions[0];
        setLandmarks(hand.landmarks);

        // Draw landmarks on canvas
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            const video = videoRef.current;
            canvasRef.current.width = video.videoWidth;
            canvasRef.current.height = video.videoHeight;
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            // Draw hand landmarks
            for (const landmark of hand.landmarks) {
              ctx.beginPath();
              ctx.arc(landmark[0], landmark[1], 5, 0, 2 * Math.PI);
              ctx.fillStyle = '#00ff00';
              ctx.fill();
            }

            // Draw connections
            const connections = [
              [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
              [0, 5], [5, 6], [6, 7], [7, 8], // Index
              [0, 9], [9, 10], [10, 11], [11, 12], // Middle
              [0, 13], [13, 14], [14, 15], [15, 16], // Ring
              [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
              [5, 9], [9, 13], [13, 17] // Palm
            ];

            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            for (const [start, end] of connections) {
              ctx.beginPath();
              ctx.moveTo(hand.landmarks[start][0], hand.landmarks[start][1]);
              ctx.lineTo(hand.landmarks[end][0], hand.landmarks[end][1]);
              ctx.stroke();
            }
          }
        }

        // Recognize ASL letter using geometric analysis
        const result = recognizeASLLetter(hand.landmarks);
        
        if (result && result.confidence >= 60) { // Minimum 60% confidence
          // Add to gesture history for stability
          gestureHistoryRef.current.push(result.letter);
          if (gestureHistoryRef.current.length > 6) {
            gestureHistoryRef.current.shift();
          }
          
          // Count occurrences of each gesture
          const counts: Record<string, number> = {};
          for (const g of gestureHistoryRef.current) {
            counts[g] = (counts[g] || 0) + 1;
          }
          
          // Find the most common gesture
          let maxCount = 0;
          let stableLetter: string | null = null;
          for (const [letter, count] of Object.entries(counts)) {
            if (count > maxCount && count >= 3) {
              maxCount = count;
              stableLetter = letter;
            }
          }
          
          if (stableLetter) {
            setCurrentGesture(stableLetter);
            setConfidence(result.confidence);
          } else {
            setCurrentGesture(null);
            setConfidence(0);
          }
        } else {
          gestureHistoryRef.current = [];
          setCurrentGesture(null);
          setConfidence(0);
        }
      } else {
        setHandDetected(false);
        setCurrentGesture(null);
        setConfidence(0);
        setLandmarks(null);
        gestureHistoryRef.current = [];

        // Clear canvas
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }
      }
    } catch (error) {
      console.error('Detection error:', error);
    }

    animationFrameRef.current = requestAnimationFrame(detect);
  }, [isEnabled, videoRef, canvasRef]);

  // Start/stop detection loop
  useEffect(() => {
    if (isEnabled && isModelLoaded) {
      animationFrameRef.current = requestAnimationFrame(detect);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isEnabled, isModelLoaded, detect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isModelLoading,
    isModelLoaded,
    handDetected,
    currentGesture,
    confidence,
    landmarks,
  };
};

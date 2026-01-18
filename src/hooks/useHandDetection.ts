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

// Helper functions for geometric analysis
const distance = (p1: number[], p2: number[]): number => {
  return Math.sqrt(
    Math.pow(p1[0] - p2[0], 2) + 
    Math.pow(p1[1] - p2[1], 2) + 
    Math.pow(p1[2] - p2[2], 2)
  );
};

const isFingerExtended = (landmarks: number[][], mcp: number, pip: number, dip: number, tip: number): boolean => {
  const mcpToPip = distance(landmarks[mcp], landmarks[pip]);
  const pipToTip = distance(landmarks[pip], landmarks[tip]);
  const mcpToTip = distance(landmarks[mcp], landmarks[tip]);
  
  // Finger is extended if tip is far from MCP relative to the finger length
  return mcpToTip > (mcpToPip + pipToTip) * 0.7;
};

const isFingerCurled = (landmarks: number[][], mcp: number, pip: number, dip: number, tip: number): boolean => {
  const mcpToTip = distance(landmarks[mcp], landmarks[tip]);
  const mcpToPip = distance(landmarks[mcp], landmarks[pip]);
  
  // Finger is curled if tip is close to MCP
  return mcpToTip < mcpToPip * 1.5;
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

const areFingersTouching = (landmarks: number[][], tip1: number, tip2: number): boolean => {
  return distance(landmarks[tip1], landmarks[tip2]) < 40;
};

// ASL Letter recognition based on landmark geometry
const recognizeASLLetter = (landmarks: number[][]): { letter: string; confidence: number } | null => {
  const fingers = getFingerStates(landmarks);
  const extendedCount = [fingers.index, fingers.middle, fingers.ring, fingers.pinky].filter(Boolean).length;
  
  // Calculate some additional metrics
  const thumbTip = landmarks[LANDMARK.THUMB_TIP];
  const indexTip = landmarks[LANDMARK.INDEX_TIP];
  const middleTip = landmarks[LANDMARK.MIDDLE_TIP];
  const ringTip = landmarks[LANDMARK.RING_TIP];
  const pinkyTip = landmarks[LANDMARK.PINKY_TIP];
  const wrist = landmarks[LANDMARK.WRIST];
  
  const thumbIndexDist = distance(thumbTip, indexTip);
  const indexMiddleDist = distance(indexTip, middleTip);
  
  // Y - Thumb and pinky extended, others curled (very distinctive - shaka sign)
  if (fingers.thumb && fingers.pinky && !fingers.index && !fingers.middle && !fingers.ring) {
    return { letter: 'Y', confidence: 9.5 };
  }
  
  // I - Only pinky extended
  if (fingers.pinky && !fingers.index && !fingers.middle && !fingers.ring && !fingers.thumb) {
    return { letter: 'I', confidence: 9.0 };
  }
  
  // L - Thumb and index extended at 90 degrees, others curled
  if (fingers.thumb && fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    if (isIndexPointingUp(landmarks)) {
      return { letter: 'L', confidence: 9.0 };
    }
    // G - Index and thumb pointing sideways
    if (isIndexPointingSideways(landmarks)) {
      return { letter: 'G', confidence: 8.5 };
    }
  }
  
  // D - Only index extended pointing up, thumb touching middle
  if (fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && isIndexPointingUp(landmarks)) {
    return { letter: 'D', confidence: 8.5 };
  }
  
  // W - Index, middle, ring extended, pinky curled
  if (fingers.index && fingers.middle && fingers.ring && !fingers.pinky) {
    return { letter: 'W', confidence: 9.0 };
  }
  
  // F - Middle, ring, pinky extended; index and thumb touching
  if (!fingers.index && fingers.middle && fingers.ring && fingers.pinky) {
    if (thumbIndexDist < 50) {
      return { letter: 'F', confidence: 8.5 };
    }
  }
  
  // V - Index and middle extended and spread, ring and pinky curled
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    if (indexMiddleDist > 40) { // Spread apart
      return { letter: 'V', confidence: 9.0 };
    }
    // U - Index and middle extended together
    if (indexMiddleDist < 40) {
      // Check if pointing sideways for H
      if (isIndexPointingSideways(landmarks)) {
        return { letter: 'H', confidence: 8.0 };
      }
      return { letter: 'U', confidence: 8.5 };
    }
  }
  
  // R - Index and middle extended and crossed
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    // R has fingers crossed - middle tip is closer to index MCP
    const middleToIndexMcp = distance(middleTip, landmarks[LANDMARK.INDEX_MCP]);
    const indexToMiddleMcp = distance(indexTip, landmarks[LANDMARK.MIDDLE_MCP]);
    if (middleToIndexMcp < indexToMiddleMcp) {
      return { letter: 'R', confidence: 8.0 };
    }
  }
  
  // B - All four fingers extended, thumb tucked
  if (fingers.index && fingers.middle && fingers.ring && fingers.pinky && !fingers.thumb) {
    return { letter: 'B', confidence: 9.0 };
  }
  
  // Five/Open hand - All fingers extended (not an ASL letter but useful reference)
  if (fingers.thumb && fingers.index && fingers.middle && fingers.ring && fingers.pinky) {
    // Could be "5" or open hand, but check for specific letters
    // K - Index and middle up with thumb between (like a modified V)
    const thumbToIndex = distance(thumbTip, landmarks[LANDMARK.INDEX_MCP]);
    const thumbToMiddle = distance(thumbTip, landmarks[LANDMARK.MIDDLE_MCP]);
    if (thumbToIndex < 50 && thumbToMiddle < 50) {
      return { letter: 'K', confidence: 7.5 };
    }
  }
  
  // C - All fingers curved (half-curled) forming a C shape
  const indexCurved = !fingers.index && !isFingerCurled(landmarks, LANDMARK.INDEX_MCP, LANDMARK.INDEX_PIP, LANDMARK.INDEX_DIP, LANDMARK.INDEX_TIP);
  const middleCurved = !fingers.middle && !isFingerCurled(landmarks, LANDMARK.MIDDLE_MCP, LANDMARK.MIDDLE_PIP, LANDMARK.MIDDLE_DIP, LANDMARK.MIDDLE_TIP);
  if (indexCurved && middleCurved && extendedCount === 0) {
    // Check if thumb is opposite to fingers (C shape)
    const thumbToFingers = distance(thumbTip, indexTip);
    if (thumbToFingers > 60 && thumbToFingers < 150) {
      return { letter: 'C', confidence: 7.5 };
    }
  }
  
  // O - All fingers curved touching thumb to form circle
  if (extendedCount === 0) {
    const thumbToIndex = distance(thumbTip, indexTip);
    const thumbToMiddle = distance(thumbTip, middleTip);
    if (thumbToIndex < 50 && thumbToMiddle < 60) {
      return { letter: 'O', confidence: 8.0 };
    }
  }
  
  // X - Index finger bent/hooked, others curled
  if (!fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    const indexPip = landmarks[LANDMARK.INDEX_PIP];
    const indexTipToWrist = distance(indexTip, wrist);
    const indexPipToWrist = distance(indexPip, wrist);
    // X has index hooked - tip is closer to wrist than PIP
    if (indexTipToWrist < indexPipToWrist) {
      return { letter: 'X', confidence: 7.5 };
    }
  }
  
  // A - Fist with thumb to the side (thumb alongside, not over)
  if (!fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    const thumbToWrist = distance(thumbTip, wrist);
    const indexMcpToWrist = distance(landmarks[LANDMARK.INDEX_MCP], wrist);
    if (thumbToWrist > indexMcpToWrist * 0.8) {
      return { letter: 'A', confidence: 7.0 };
    }
  }
  
  // S - Fist with thumb over fingers
  if (!fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && !fingers.thumb) {
    return { letter: 'S', confidence: 7.0 };
  }
  
  // E - All fingers curled with fingertips touching palm/thumb
  if (extendedCount === 0) {
    const indexToThumb = distance(indexTip, thumbTip);
    const middleToThumb = distance(middleTip, thumbTip);
    if (indexToThumb < 60 && middleToThumb < 60) {
      return { letter: 'E', confidence: 7.0 };
    }
  }
  
  return null;
};

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
        
        if (result) {
          // Add to gesture history for stability
          gestureHistoryRef.current.push(result.letter);
          if (gestureHistoryRef.current.length > 5) {
            gestureHistoryRef.current.shift();
          }
          
          // Only show gesture if it appears at least 3 times in last 5 detections
          const counts: Record<string, number> = {};
          for (const g of gestureHistoryRef.current) {
            counts[g] = (counts[g] || 0) + 1;
          }
          
          const stableLetter = Object.entries(counts).find(([_, count]) => count >= 3);
          
          if (stableLetter) {
            setCurrentGesture(stableLetter[0]);
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

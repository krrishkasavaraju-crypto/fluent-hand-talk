import { useState, useEffect, useRef, useCallback } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs';
import * as fp from 'fingerpose';

// Define all 26 ASL letter gestures using fingerpose based on standard ASL alphabet
const createASLGestures = () => {
  const gestures: fp.GestureDescription[] = [];

  // A - Fist with thumb on side (thumb alongside, not over fingers)
  const aGesture = new fp.GestureDescription('A');
  aGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  aGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
  aGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  aGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  aGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  aGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 0.8);
  gestures.push(aGesture);

  // B - Flat hand, fingers together pointing up, thumb tucked across palm
  const bGesture = new fp.GestureDescription('B');
  bGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  bGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  bGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  bGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
  bGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
  bGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 0.8);
  gestures.push(bGesture);

  // C - Curved hand like holding a cup, all fingers curved together
  const cGesture = new fp.GestureDescription('C');
  cGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 0.8);
  cGesture.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);
  cGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.HalfCurl, 1.0);
  cGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 1.0);
  cGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 1.0);
  gestures.push(cGesture);

  // D - Index up, others curled touching thumb forming circle
  const dGesture = new fp.GestureDescription('D');
  dGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  dGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  dGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  dGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  dGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  dGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 0.8);
  gestures.push(dGesture);

  // E - All fingertips touching thumb, bent down
  const eGesture = new fp.GestureDescription('E');
  eGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  eGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
  eGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  eGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  eGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  gestures.push(eGesture);

  // F - Three fingers up (middle, ring, pinky), index and thumb touching in circle
  const fGesture = new fp.GestureDescription('F');
  fGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  fGesture.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);
  fGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  fGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
  fGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
  gestures.push(fGesture);

  // G - Index and thumb pointing sideways, parallel to ground
  const gGesture = new fp.GestureDescription('G');
  gGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  gGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  gGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  gGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  gGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  gGesture.addDirection(fp.Finger.Index, fp.FingerDirection.HorizontalLeft, 0.8);
  gGesture.addDirection(fp.Finger.Index, fp.FingerDirection.HorizontalRight, 0.8);
  gestures.push(gGesture);

  // H - Index and middle fingers pointing sideways, parallel
  const hGesture = new fp.GestureDescription('H');
  hGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  hGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  hGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  hGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  hGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  hGesture.addDirection(fp.Finger.Index, fp.FingerDirection.HorizontalLeft, 0.8);
  hGesture.addDirection(fp.Finger.Index, fp.FingerDirection.HorizontalRight, 0.8);
  gestures.push(hGesture);

  // I - Pinky up, all others curled
  const iGesture = new fp.GestureDescription('I');
  iGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  iGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
  iGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  iGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  iGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
  iGesture.addDirection(fp.Finger.Pinky, fp.FingerDirection.VerticalUp, 0.8);
  gestures.push(iGesture);

  // K - Index up, middle finger angled forward, thumb between them
  const kGesture = new fp.GestureDescription('K');
  kGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  kGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  kGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 0.8);
  kGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  kGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  kGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 0.8);
  gestures.push(kGesture);

  // L - L shape with thumb and index at 90 degrees
  const lGesture = new fp.GestureDescription('L');
  lGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  lGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  lGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  lGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  lGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  lGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalLeft, 0.8);
  lGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalRight, 0.8);
  lGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 0.8);
  gestures.push(lGesture);

  // M - Three fingers over thumb (fist with thumb under index, middle, ring)
  const mGesture = new fp.GestureDescription('M');
  mGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
  mGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
  mGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  mGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  mGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  gestures.push(mGesture);

  // N - Two fingers over thumb (fist with thumb under index and middle)
  const nGesture = new fp.GestureDescription('N');
  nGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
  nGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
  nGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  nGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  nGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  gestures.push(nGesture);

  // O - All fingers curved to touch thumb forming a circle
  const oGesture = new fp.GestureDescription('O');
  oGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  oGesture.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);
  oGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.HalfCurl, 1.0);
  oGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 1.0);
  oGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 1.0);
  gestures.push(oGesture);

  // P - K handshape but pointing down
  const pGesture = new fp.GestureDescription('P');
  pGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  pGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  pGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 0.8);
  pGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  pGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  pGesture.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalDownLeft, 0.8);
  pGesture.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalDownRight, 0.8);
  gestures.push(pGesture);

  // Q - G handshape but pointing down
  const qGesture = new fp.GestureDescription('Q');
  qGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  qGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  qGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  qGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  qGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  qGesture.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalDownLeft, 0.8);
  qGesture.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalDownRight, 0.8);
  gestures.push(qGesture);

  // R - Crossed index and middle fingers
  const rGesture = new fp.GestureDescription('R');
  rGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  rGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  rGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  rGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  rGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  rGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 0.8);
  gestures.push(rGesture);

  // S - Fist with thumb over fingers
  const sGesture = new fp.GestureDescription('S');
  sGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  sGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
  sGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  sGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  sGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  gestures.push(sGesture);

  // T - Fist with thumb between index and middle
  const tGesture = new fp.GestureDescription('T');
  tGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  tGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
  tGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  tGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  tGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  gestures.push(tGesture);

  // U - Index and middle fingers up together (touching)
  const uGesture = new fp.GestureDescription('U');
  uGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  uGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  uGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  uGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  uGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  uGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 0.8);
  gestures.push(uGesture);

  // V - Index and middle fingers up and spread (peace sign)
  const vGesture = new fp.GestureDescription('V');
  vGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  vGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  vGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  vGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  vGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  vGesture.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 0.6);
  vGesture.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpRight, 0.6);
  gestures.push(vGesture);

  // W - Index, middle, and ring fingers up and spread
  const wGesture = new fp.GestureDescription('W');
  wGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  wGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  wGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  wGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
  wGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  wGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 0.8);
  gestures.push(wGesture);

  // X - Index finger hooked/bent, others curled
  const xGesture = new fp.GestureDescription('X');
  xGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  xGesture.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);
  xGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  xGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  xGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  gestures.push(xGesture);

  // Y - Thumb and pinky out, others curled (shaka/hang loose)
  const yGesture = new fp.GestureDescription('Y');
  yGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  yGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
  yGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  yGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  yGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
  gestures.push(yGesture);

  return gestures;
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
  const gestureEstimatorRef = useRef<fp.GestureEstimator | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastDetectionRef = useRef<number>(0);

  // Load the model
  useEffect(() => {
    const loadModel = async () => {
      if (modelRef.current || isModelLoading) return;

      setIsModelLoading(true);
      try {
        console.log('Loading HandPose model...');
        const model = await handpose.load();
        modelRef.current = model;
        
        // Create gesture estimator with ASL gestures
        const aslGestures = createASLGestures();
        gestureEstimatorRef.current = new fp.GestureEstimator(aslGestures);
        
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
    // Throttle detection to ~10 FPS for performance
    if (now - lastDetectionRef.current < 100) {
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

        // Estimate gesture
        if (gestureEstimatorRef.current) {
          const estimatedGestures = gestureEstimatorRef.current.estimate(
            hand.landmarks,
            7.5 // Minimum confidence score
          );

          if (estimatedGestures.gestures.length > 0) {
            // Get the gesture with highest confidence
            const bestGesture = estimatedGestures.gestures.reduce(
              (prev: fp.GestureEstimate, curr: fp.GestureEstimate) => 
                (curr.score > prev.score ? curr : prev)
            );
            setCurrentGesture(bestGesture.name);
            setConfidence(bestGesture.score);
          } else {
            setCurrentGesture(null);
            setConfidence(0);
          }
        }
      } else {
        setHandDetected(false);
        setCurrentGesture(null);
        setConfidence(0);
        setLandmarks(null);

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

// import React, { useState, useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import { Camera, Check, X } from "lucide-react";
// import { Alert, AlertDescription } from "../../components/tools/Alert";

// const FacialVerification = ({ onComplete }) => {
//   const { userInfo, token } = useSelector((state) => state.auth);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [session, setSession] = useState(null);
//   const [currentGesture, setCurrentGesture] = useState(null);
//   const [stream, setStream] = useState(null);
//   const [countdown, setCountdown] = useState(null);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState({
//     variant: "default",
//     message: "",
//   });

//   // Gesture instructions mapping
//   const gestureInstructions = {
//     smile: "Please smile naturally for the camera",
//     eye_close: "Please blink (close both eyes) for a moment",
//     mouth_open: "Please open your mouth slightly",
//   };

//   // Show alert message
//   const showAlertMessage = (message, variant = "default") => {
//     setAlertConfig({ message, variant });
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 5000);
//   };

//   // Initiate verification
//   const initiateVerification = async () => {
//     try {
//       const response = await fetch(
//         "http://backend.edirect.ng/api/verification/initiate",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token.token}`,
//           },
//           body: JSON.stringify({ user_id: userInfo.id }),
//         }
//       );
//       const data = await response.json();
//       if (data.status === "success") {
//         setSession(data.data);
//         setCurrentGesture(data.data.required_gestures[0]);
//         startCamera();
//       } else {
//         throw new Error(data.message || "Failed to initiate verification");
//       }
//     } catch (error) {
//       showAlertMessage(error.message, "destructive");
//     }
//   };

//   // Start camera
//   const startCamera = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "user" },
//       });
//       setStream(mediaStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//       }
//     } catch (error) {
//       showAlertMessage(
//         "Camera access denied. Please allow camera permissions.",
//         "destructive"
//       );
//     }
//   };

//   // Capture photo
//   const capturePhoto = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     setCountdown(3);
//     const interval = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev === 1) {
//           clearInterval(interval);
//           const context = canvasRef.current.getContext("2d");
//           context.drawImage(videoRef.current, 0, 0, 640, 480);
//           verifyGesture();
//           return null;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   // Verify gesture
//   const verifyGesture = async () => {
//     const formData = new FormData();
//     canvasRef.current.toBlob(async (blob) => {
//       formData.append("session_id", session.session_id);
//       formData.append("photo", blob, "gesture.jpg");
//       formData.append("gesture", currentGesture);

//       try {
//         const response = await fetch(
//           "http://backend.edirect.ng/api/verification/verify-gesture",
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${token.token}`,
//             },
//             body: formData,
//           }
//         );
//         const data = await response.json();
//         if (data.status === "success") {
//           showAlertMessage("Gesture verified successfully!", "success");
//           if (data.data.is_completed) {
//             handleCompletion();
//           } else {
//             setCurrentGesture(data.data.remaining_gestures[0]);
//           }
//         } else {
//           throw new Error(data.message || "Gesture verification failed");
//         }
//       } catch (error) {
//         showAlertMessage(error.message, "destructive");
//       }
//     }, "image/jpeg");
//   };

//   // Handle completion
//   const handleCompletion = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }
//     onComplete();
//   };

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [stream]);

//   // Start verification on mount
//   useEffect(() => {
//     initiateVerification();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">
//           Facial Verification
//         </h2>

//         {session && currentGesture ? (
//           <div className="space-y-6">
//             {/* Instructions */}
//             <p className="text-sm text-gray-600 text-center">
//               {gestureInstructions[currentGesture]}
//             </p>

//             {/* Video Preview */}
//             <div className="relative flex justify-center">
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 className="rounded-lg w-full max-w-md"
//                 width="640"
//                 height="480"
//                 aria-label="Camera preview"
//               />
//               {countdown && (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="text-6xl font-bold text-white bg-black/50 rounded-full w-20 h-20 flex items-center justify-center">
//                     {countdown}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Hidden canvas for capturing */}
//             <canvas
//               ref={canvasRef}
//               width="640"
//               height="480"
//               className="hidden"
//             />

//             {/* Progress */}
//             <div className="text-sm text-gray-600 text-center">
//               Gestures completed:{" "}
//               {session.required_gestures.length -
//                 session.required_gestures.length +
//                 session.required_gestures.indexOf(currentGesture)}{" "}
//               / {session.required_gestures.length}
//             </div>

//             {/* Capture Button */}
//             <button
//               onClick={capturePhoto}
//               disabled={countdown !== null}
//               className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
//               aria-label="Capture photo">
//               <Camera size={18} className="mr-2" />
//               Capture
//             </button>
//           </div>
//         ) : (
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
//             <p className="text-sm text-gray-600">
//               Initializing verification...
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Alert */}
//       {showAlert && (
//         <Alert
//           variant={alertConfig.variant}
//           show={showAlert}
//           onClose={() => setShowAlert(false)}
//           autoClose={true}
//           autoCloseTime={5000}>
//           <AlertDescription>{alertConfig.message}</AlertDescription>
//         </Alert>
//       )}
//     </div>
//   );
// };

// export default FacialVerification;

// import React, { useState, useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import { Camera, Check, X, RefreshCw, LogOut } from "lucide-react";
// import { Alert, AlertDescription } from "../../components/tools/Alert";

// const FacialVerification = ({ onComplete, onExit }) => {
//   const { userInfo, token } = useSelector((state) => state.auth);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [session, setSession] = useState(null);
//   const [currentGesture, setCurrentGesture] = useState(null);
//   const [stream, setStream] = useState(null);
//   const [countdown, setCountdown] = useState(null);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState({
//     variant: "default",
//     message: "",
//   });
//   const [isLoading, setIsLoading] = useState({
//     initiating: true,
//     verifying: false,
//   });
//   const [error, setError] = useState(null);

//   // Gesture instructions mapping
//   const gestureInstructions = {
//     smile: "Please smile naturally for the camera",
//     eye_close: "Please blink (close both eyes) for a moment",
//     mouth_open: "Please open your mouth slightly",
//   };

//   // Show alert message
//   const showAlertMessage = (message, variant = "default") => {
//     setAlertConfig({ message, variant });
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 5000);
//   };

//   // Initiate verification
//   const initiateVerification = async () => {
//     setIsLoading({ ...isLoading, initiating: true });
//     setError(null);

//     try {
//       const response = await fetch(
//         "http://backend.edirect.ng/api/verification/initiate",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token.token}`,
//           },
//           body: JSON.stringify({ user_id: userInfo.id }),
//         }
//       );

//       const data = await response.json();
//       console.log(data, "data response");
//       console.log(token.token, "auth token");
//       console.log(userInfo.id, "user ID");

//       if (data.status === "success") {
//         setSession(data.data);
//         setCurrentGesture(data.data.required_gestures[0]);
//         await startCamera();
//       } else {
//         throw new Error(data.message || "Failed to initiate verification");
//       }
//     } catch (error) {
//       setError(error.message || "Failed to initiate verification");
//       showAlertMessage(error.message, "destructive");
//     } finally {
//       setIsLoading({ ...isLoading, initiating: false });
//     }
//   };

//   // Start camera
//   const startCamera = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "user" },
//       });
//       setStream(mediaStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//       }
//       return true;
//     } catch (error) {
//       setError("Camera access denied. Please allow camera permissions.");
//       showAlertMessage(
//         "Camera access denied. Please allow camera permissions.",
//         "destructive"
//       );
//       return false;
//     }
//   };

//   // Capture photo
//   const capturePhoto = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     setCountdown(3);
//     const interval = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev === 1) {
//           clearInterval(interval);
//           const context = canvasRef.current.getContext("2d");
//           canvasRef.current.width = videoRef.current.videoWidth;
//           canvasRef.current.height = videoRef.current.videoHeight;
//           context.drawImage(
//             videoRef.current,
//             0,
//             0,
//             videoRef.current.videoWidth,
//             videoRef.current.videoHeight
//           );
//           verifyGesture();
//           return null;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   // Verify gesture
//   const verifyGesture = async () => {
//     setIsLoading({ ...isLoading, verifying: true });

//     const formData = new FormData();

//     canvasRef.current.toBlob(
//       async (blob) => {
//         formData.append("session_id", session.session_id);
//         formData.append("photo", blob, "gesture.jpg");
//         formData.append("gesture", currentGesture);

//         try {
//           const response = await fetch(
//             "http://backend.edirect.ng/api/verification/verify-gesture",
//             {
//               method: "POST",
//               headers: {
//                 Authorization: `Bearer ${token.token}`,
//               },
//               body: formData,
//             }
//           );

//           const data = await response.json();

//           if (data.status === "success") {
//             showAlertMessage("Gesture verified successfully!", "success");
//             if (data.data.is_completed) {
//               handleCompletion();
//             } else {
//               setCurrentGesture(data.data.remaining_gestures[0]);
//             }
//           } else {
//             throw new Error(data.message || "Gesture verification failed");
//           }
//         } catch (error) {
//           setError(error.message || "Gesture verification failed");
//           showAlertMessage(error.message, "destructive");
//         } finally {
//           setIsLoading({ ...isLoading, verifying: false });
//         }
//       },
//       "image/jpeg",
//       0.9
//     );
//   };

//   // Handle completion
//   const handleCompletion = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }
//     onComplete();
//   };

//   // Handle exit
//   const handleExit = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }
//     if (onExit) {
//       onExit();
//     }
//   };

//   // Calculate completion percentage
//   const calculateProgress = () => {
//     if (!session || !currentGesture) return 0;

//     const currentIndex = session.required_gestures.indexOf(currentGesture);
//     const totalGestures = session.required_gestures.length;

//     return Math.round((currentIndex / totalGestures) * 100);
//   };

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [stream]);

//   // Start verification on mount
//   useEffect(() => {
//     initiateVerification();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-bold text-gray-800">
//             Facial Verification
//           </h2>
//           <button
//             onClick={handleExit}
//             className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
//             aria-label="Exit verification">
//             <LogOut size={18} />
//           </button>
//         </div>

//         {isLoading.initiating ? (
//           <div className="py-8 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
//             <p className="text-sm text-gray-600">
//               Initializing verification...
//             </p>
//           </div>
//         ) : error && !session ? (
//           <div className="py-8 text-center space-y-4">
//             <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//               <p className="font-medium mb-2">Verification Error</p>
//               <p className="text-sm">{error}</p>
//             </div>
//             <button
//               onClick={initiateVerification}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
//               aria-label="Retry">
//               <RefreshCw size={16} className="mr-2" />
//               Retry
//             </button>
//           </div>
//         ) : session && currentGesture ? (
//           <div className="space-y-6">
//             {/* Instructions */}
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <p className="text-sm text-blue-800 text-center font-medium">
//                 {gestureInstructions[currentGesture]}
//               </p>
//             </div>

//             {/* Video Preview */}
//             <div className="relative flex justify-center">
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 className="rounded-lg w-full max-w-md border border-gray-200"
//                 width="640"
//                 height="480"
//                 aria-label="Camera preview"
//               />
//               {countdown && (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="text-6xl font-bold text-white bg-black/50 rounded-full w-20 h-20 flex items-center justify-center">
//                     {countdown}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Hidden canvas for capturing */}
//             <canvas
//               ref={canvasRef}
//               width="640"
//               height="480"
//               className="hidden"
//             />

//             {/* Progress */}
//             <div className="space-y-2">
//               <div className="flex justify-between text-xs text-gray-600">
//                 <span>Progress</span>
//                 <span>
//                   {session.required_gestures.indexOf(currentGesture)} of{" "}
//                   {session.required_gestures.length} gestures
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div
//                   className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
//                   style={{ width: `${calculateProgress()}%` }}></div>
//               </div>
//             </div>

//             {/* Capture Button */}
//             <div className="flex gap-2">
//               <button
//                 onClick={capturePhoto}
//                 disabled={countdown !== null || isLoading.verifying}
//                 className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
//                 aria-label="Capture photo">
//                 {isLoading.verifying ? (
//                   <>
//                     <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <Camera size={18} className="mr-2" />
//                     Capture
//                   </>
//                 )}
//               </button>

//               {error && (
//                 <button
//                   onClick={initiateVerification}
//                   className="px-4 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center"
//                   aria-label="Retry">
//                   <RefreshCw size={18} />
//                 </button>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="py-8 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
//             <p className="text-sm text-gray-600">
//               Initializing verification...
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Alert */}
//       {showAlert && (
//         <Alert
//           variant={alertConfig.variant}
//           show={showAlert}
//           onClose={() => setShowAlert(false)}
//           autoClose={true}
//           autoCloseTime={5000}>
//           <AlertDescription>{alertConfig.message}</AlertDescription>
//         </Alert>
//       )}
//     </div>
//   );
// };

// export default FacialVerification;

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Camera, Check, X, RefreshCw, LogOut } from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";

const FacialVerification = ({ onComplete, onExit }) => {
  const { userInfo, token } = useSelector((state) => state.auth);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [session, setSession] = useState(null);
  const [currentGesture, setCurrentGesture] = useState(null);
  const [stream, setStream] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [isLoading, setIsLoading] = useState({
    initiating: true,
    verifying: false,
    checking: false,
  });
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null); // Store captured image
  const [isVerified, setIsVerified] = useState(false); // Track verification status

  const gestureInstructions = {
    smile: "Please smile naturally for the camera",
    eye_close: "Please blink (close both eyes) for a moment",
    mouth_open: "Please open your mouth slightly",
  };

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const initiateVerification = async () => {
    setIsLoading({ ...isLoading, initiating: true });
    setError(null);

    try {
      const response = await fetch(
        "http://backend.edirect.ng/api/verification/initiate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
          body: JSON.stringify({ user_id: userInfo.id }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setSession(data.data);
        setCurrentGesture(data.data.required_gestures[0]);
        await startCamera();
      } else {
        throw new Error(data.message || "Failed to initiate verification");
      }
    } catch (error) {
      setError(error.message || "Failed to initiate verification");
      showAlertMessage(error.message, "destructive");
    } finally {
      setIsLoading({ ...isLoading, initiating: false });
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      return true;
    } catch (error) {
      setError("Camera access denied. Please allow camera permissions.");
      showAlertMessage(
        "Camera access denied. Please allow camera permissions.",
        "destructive"
      );
      return false;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          const context = canvasRef.current.getContext("2d");
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          context.drawImage(
            videoRef.current,
            0,
            0,
            videoRef.current.videoWidth,
            videoRef.current.videoHeight
          );
          const imageDataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9); // Save image for display
          setCapturedImage(imageDataUrl);
          verifyGesture();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const verifyGesture = async () => {
    setIsLoading({ ...isLoading, verifying: true });

    const formData = new FormData();
    canvasRef.current.toBlob(
      async (blob) => {
        formData.append("session_id", session.session_id);
        formData.append("photo", blob, "gesture.jpg");
        formData.append("gesture", currentGesture);

        try {
          const response = await fetch(
            "http://backend.edirect.ng/api/verification/verify-gesture",
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token.token}` },
              body: formData,
            }
          );

          const data = await response.json();
          if (data.status === "success") {
            showAlertMessage("Gesture verified successfully!", "success");
            setIsVerified(true); // Mark as verified after first success
            handleCompletion(); // Move to next step immediately
          } else {
            throw new Error(data.message || "Gesture verification failed");
          }
        } catch (error) {
          setError(error.message || "Gesture verification failed");
          showAlertMessage(error.message, "destructive");
        } finally {
          setIsLoading({ ...isLoading, verifying: false });
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const checkVerificationStatus = async () => {
    setIsLoading({ ...isLoading, checking: true });
    try {
      const response = await fetch(
        `http://backend.edirect.ng/api/verification/status?session_id=${session.session_id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token.token}` },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        const completed = data.data.completed_gestures.includes(currentGesture);
        showAlertMessage(
          completed ? "Gesture is verified!" : "Gesture not yet verified.",
          completed ? "success" : "default"
        );
      } else {
        throw new Error(data.message || "Failed to check verification status");
      }
    } catch (error) {
      showAlertMessage(
        error.message || "Failed to check status",
        "destructive"
      );
    } finally {
      setIsLoading({ ...isLoading, checking: false });
    }
  };

  const handleCompletion = () => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
    // Don't call onComplete immediately; let user see result and check status
  };

  const handleExit = () => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
    if (onExit) onExit();
  };

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  useEffect(() => {
    initiateVerification();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Facial Verification
          </h2>
          <button
            onClick={handleExit}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Exit verification">
            <LogOut size={18} />
          </button>
        </div>

        {isLoading.initiating ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">
              Initializing verification...
            </p>
          </div>
        ) : error && !session ? (
          <div className="py-8 text-center space-y-4">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              <p className="font-medium mb-2">Verification Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={initiateVerification}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
              aria-label="Retry">
              <RefreshCw size={16} className="mr-2" />
              Retry
            </button>
          </div>
        ) : session && currentGesture ? (
          <div className="space-y-6">
            {!isVerified ? (
              <>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 text-center font-medium">
                    {gestureInstructions[currentGesture]}
                  </p>
                </div>
                <div className="relative flex justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="rounded-lg w-full max-w-md border border-gray-200"
                    width="640"
                    height="480"
                    aria-label="Camera preview"
                  />
                  {countdown && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-white bg-black/50 rounded-full w-20 h-20 flex items-center justify-center">
                        {countdown}
                      </span>
                    </div>
                  )}
                </div>
                <canvas
                  ref={canvasRef}
                  width="640"
                  height="480"
                  className="hidden"
                />
                <button
                  onClick={capturePhoto}
                  disabled={countdown !== null || isLoading.verifying}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  aria-label="Capture photo">
                  {isLoading.verifying ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Camera size={18} className="mr-2" />
                      Capture
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800 text-center font-medium">
                    Verification Successful!
                  </p>
                </div>
                {capturedImage && (
                  <div className="flex justify-center">
                    <img
                      src={capturedImage}
                      alt="Captured gesture"
                      className="rounded-lg w-full max-w-md border border-gray-200"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={checkVerificationStatus}
                    disabled={isLoading.checking}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    aria-label="Check verification status">
                    {isLoading.checking ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Checking...
                      </>
                    ) : (
                      <>
                        <Check size={18} className="mr-2" />
                        Check Status
                      </>
                    )}
                  </button>
                  <button
                    onClick={onComplete}
                    className="px-4 py-3 bg-green text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                    aria-label="Continue">
                    Continue
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">
              Initializing verification...
            </p>
          </div>
        )}
      </div>

      {showAlert && (
        <Alert
          variant={alertConfig.variant}
          show={showAlert}
          onClose={() => setShowAlert(false)}
          autoClose={true}
          autoCloseTime={5000}>
          <AlertDescription>{alertConfig.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FacialVerification;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Camera,
  QrCode,
  Zap,
  RotateCcw,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { decodeQrFromImageData, parseScannedTableText, playScanBeep } from '../../utils/qrUtils';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess?: (table: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const { availableTables, setTableNumber, tableNumber } = useRestaurant();

  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'test'>('camera');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLoopRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream cleanly
  const stopCamera = useCallback(() => {
    if (scanLoopRef.current) {
      cancelAnimationFrame(scanLoopRef.current);
      scanLoopRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  // Handle successful table scan
  const handleDetected = useCallback(
    (rawText: string) => {
      const detectedTable = parseScannedTableText(rawText, availableTables);
      if (detectedTable) {
        stopCamera();
        playScanBeep();
        setScannedResult(detectedTable);
        setTableNumber(detectedTable);
        if (onScanSuccess) {
          onScanSuccess(detectedTable);
        }
      }
    },
    [availableTables, onScanSuccess, setTableNumber, stopCamera]
  );

  // Scan video frame loop using jsQR
  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const decoded = decodeQrFromImageData(
          imageData.data,
          imageData.width,
          imageData.height
        );
        if (decoded) {
          handleDetected(decoded);
          return;
        }
      }
    }
    scanLoopRef.current = requestAnimationFrame(scanFrame);
  }, [handleDetected]);

  // Start camera stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setScannedResult(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCamera(false);
      setCameraError('Camera access is not supported by your browser or environment.');
      return;
    }

    try {
      // Prefer back camera on mobile devices
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setHasCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanning(true);
        scanLoopRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err: unknown) {
      console.warn('Camera stream error:', err);
      setHasCamera(false);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Unable to access camera. Please allow camera permissions.';
      setCameraError(
        errorMsg.includes('Permission') || errorMsg.includes('NotAllowedError')
          ? 'Camera permission was denied. Please allow camera access or use the Quick Test / Upload option below.'
          : 'Could not connect to camera on this device. You can test by selecting any table or uploading a QR image.'
      );
    }
  }, [scanFrame, stopCamera]);

  // Toggle flashlight / torch if supported
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const capabilities = track.getCapabilities ? (track.getCapabilities() as unknown as { torch?: boolean }) : {};
      if (capabilities.torch) {
        const nextState = !torchOn;
        await (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setTorchOn(nextState);
      }
    } catch (e) {
      console.log('Torch not supported:', e);
    }
  };

  // Decode uploaded image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const decoded = decodeQrFromImageData(imgData.data, imgData.width, imgData.height);
        if (decoded) {
          handleDetected(decoded);
        } else {
          alert('Could not detect a valid QR code in this image. Please try another photo or select your table below.');
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isOpen) {
      setScannedResult(null);
      if (activeTab === 'camera') {
        startCamera();
      }
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-900/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center ring-1 ring-amber-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-neutral-900 dark:text-neutral-50">
                  Scan Table QR Code
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300">
                  Live
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Point your camera at the acrylic stand on your table
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-950/40 p-1.5 gap-1.5 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('camera');
              startCamera();
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'camera'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera Scanner</span>
          </button>
          <button
            onClick={() => {
              stopCamera();
              setActiveTab('test');
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'test'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Test / Quick Select</span>
          </button>
          <button
            onClick={() => {
              stopCamera();
              setActiveTab('upload');
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* SUCCESS BANNER */}
          {scannedResult ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 text-center animate-scaleUp">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="inline-block text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 mb-2">
                QR Code Successfully Scanned!
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-50 mb-1">
                Connected to {scannedResult}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mb-5 max-w-sm mx-auto">
                Welcome to Uncle’s Chinese. You can now browse our menu, add dishes to your cart, or call your waiter anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                <button
                  onClick={() => {
                    setScannedResult(null);
                    if (activeTab === 'camera') startCamera();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Scan Different Table</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Start Ordering Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : activeTab === 'camera' ? (
            /* CAMERA SCANNER TAB */
            <div className="space-y-4">
              <div className="relative aspect-square max-w-xs sm:max-w-sm mx-auto rounded-3xl overflow-hidden bg-black shadow-inner border-2 border-neutral-700">
                {/* Live video feed */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />

                {/* Viewfinder Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                  {/* Outer dimmed mask */}
                  <div className="relative w-52 h-52 sm:w-60 sm:h-60 border-2 border-amber-400/80 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                    {/* Corner Reticle Brackets */}
                    <span className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                    <span className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
                    <span className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
                    <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />

                    {/* Animated Sweeping Laser */}
                    {isScanning && (
                      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-scanBeam" />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <QrCode className="w-24 h-24 text-white" />
                    </div>
                  </div>
                </div>

                {/* Torch / Flash button */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    onClick={toggleTorch}
                    title="Toggle Flashlight"
                    className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                      torchOn
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/50'
                        : 'bg-black/50 text-white/80 hover:bg-black/70'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                  <button
                    onClick={startCamera}
                    title="Restart Camera"
                    className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white/80 backdrop-blur-md transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {cameraError && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div className="flex-1">
                    <p className="font-semibold">{cameraError}</p>
                    <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                      Tip: You can switch to the <strong>Test / Quick Select</strong> tab to simulate scanning any table immediately without physical camera access.
                    </p>
                  </div>
                </div>
              )}

              <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
                Hold phone steady over the QR code on the acrylic table stand.
              </p>
            </div>
          ) : activeTab === 'test' ? (
            /* QUICK SELECT / SIMULATION TAB */
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Instant Table Scanner Simulator
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Tap any table below to simulate scanning its unique QR code with instant sound and feedback:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableTables.map((tbl) => {
                  const isCurrent = tableNumber === tbl;
                  const isAC = tbl.includes('AC');
                  const isParcel = tbl.includes('Parcel');

                  return (
                    <button
                      key={tbl}
                      onClick={() => handleDetected(tbl)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all group ${
                        isCurrent
                          ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 text-neutral-900 dark:text-neutral-50 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                            isCurrent
                              ? 'bg-amber-500 text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:bg-amber-500 group-hover:text-white transition-colors'
                          }`}
                        >
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-neutral-900 dark:text-neutral-100">
                            {tbl}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {isAC && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                                AC Room
                              </span>
                            )}
                            {isParcel && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                Takeaway
                              </span>
                            )}
                            <span className="text-[10px] text-neutral-400 group-hover:text-amber-600 transition-colors">
                              Tap to scan
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                })}
              </div>

              {/* Manual Input Fallback */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Or enter table code manually:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="e.g. Table 4 or T-04"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    onClick={() => {
                      if (manualInput.trim()) {
                        handleDetected(manualInput);
                      }
                    }}
                    disabled={!manualInput.trim()}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* UPLOAD QR IMAGE TAB */
            <div className="space-y-4 text-center py-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-amber-500 dark:hover:border-amber-500 rounded-3xl p-8 cursor-pointer transition-all bg-neutral-50/50 dark:bg-neutral-900/50 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 flex flex-col items-center justify-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  Upload a photo of your Table QR Code
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mb-4">
                  Select a screenshot or photo from your camera roll containing the table QR code
                </p>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold shadow-md hover:bg-neutral-800 transition-all"
                >
                  Choose File or Photo
                </button>
              </div>
            </div>
          )}

          {/* Quick Info & Customer Support */}
          <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>
              Currently seated at: <strong className="text-neutral-900 dark:text-neutral-200">{tableNumber}</strong>. Scanning automatically updates your orders, waiter alerts, and bill requests.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">
            Uncle’s Chinese • Tulinj Road, Nallasopara (E)
          </span>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

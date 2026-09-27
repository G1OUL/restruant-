import QRCode from 'qrcode';
import jsQR from 'jsqr';

/**
 * Builds the canonical customer scan URL for a specific table.
 */
export const getTableScanUrl = (tableNumber: string): string => {
  if (typeof window === 'undefined') return `https://uncleschinese.app/?table=${encodeURIComponent(tableNumber)}`;
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?table=${encodeURIComponent(tableNumber)}`;
};

/**
 * Generates a high-quality data URL (PNG) for a QR code string.
 */
export const generateQRCodeDataUrl = async (
  text: string,
  options?: {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      width: options?.width || 320,
      margin: options?.margin !== undefined ? options?.margin : 2,
      color: {
        dark: options?.color?.dark || '#18181b', // neutral-900
        light: options?.color?.light || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate QR data URL:', err);
    throw err;
  }
};

/**
 * Generates an SVG string representation of a QR code.
 */
export const generateQRCodeSvg = async (
  text: string,
  options?: {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
): Promise<string> => {
  try {
    return await QRCode.toString(text, {
      type: 'svg',
      width: options?.width || 320,
      margin: options?.margin !== undefined ? options?.margin : 2,
      color: {
        dark: options?.color?.dark || '#18181b',
        light: options?.color?.light || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate QR SVG:', err);
    throw err;
  }
};

/**
 * Extracts table identifier from a scanned string (URL or plain table text).
 */
export const parseScannedTableText = (scannedText: string, availableTables: string[]): string | null => {
  if (!scannedText) return null;
  const clean = scannedText.trim();

  // 1. Try URL parameter extraction
  try {
    if (clean.includes('table=') || clean.includes('t=')) {
      const url = new URL(clean.startsWith('http') ? clean : `https://dummy.com/${clean}`);
      const param = url.searchParams.get('table') || url.searchParams.get('t');
      if (param) {
        const decoded = decodeURIComponent(param);
        const directMatch = availableTables.find(
          (t) => t.toLowerCase() === decoded.toLowerCase()
        );
        if (directMatch) return directMatch;

        const partialMatch = availableTables.find((t) =>
          t.toLowerCase().includes(decoded.toLowerCase())
        );
        if (partialMatch) return partialMatch;
        return decoded;
      }
    }
  } catch {
    // continue to text matching
  }

  // 2. Direct string match against available tables
  const exactMatch = availableTables.find(
    (t) => t.toLowerCase() === clean.toLowerCase()
  );
  if (exactMatch) return exactMatch;

  // 3. Number or partial match e.g. "Table 4", "T-4", "4"
  const digits = clean.match(/\d+/);
  if (digits) {
    const num = digits[0];
    const matchByNum = availableTables.find((t) => {
      const isAC = clean.toLowerCase().includes('ac');
      if (isAC && t.toLowerCase().includes('ac') && t.includes(num)) return true;
      if (!isAC && !t.toLowerCase().includes('ac') && t.includes(num)) return true;
      return t.includes(num);
    });
    if (matchByNum) return matchByNum;
  }

  // 4. Return as-is if reasonably formatted, else null
  if (clean.length > 0 && clean.length < 50) {
    return clean;
  }

  return null;
};

/**
 * Decodes a QR code from HTML video frame or canvas image data using jsQR.
 */
export const decodeQrFromImageData = (
  data: Uint8ClampedArray,
  width: number,
  height: number
): string | null => {
  try {
    const code = jsQR(data, width, height, {
      inversionAttempts: 'dontInvert',
    });
    if (code && code.data) {
      return code.data;
    }
  } catch (err) {
    console.warn('jsQR decoding error:', err);
  }
  return null;
};

/**
 * Synthesizes a positive scan chirp sound & triggers haptic vibration
 */
export const playScanBeep = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1480, now);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);

    // Vibration on supported mobile devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([40, 20, 40]);
    }
  } catch {
    // fallback
  }
};

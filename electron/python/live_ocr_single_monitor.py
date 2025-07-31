import mss
import numpy as np
import cv2
import pytesseract
import time
from Levenshtein import ratio

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Set this to your monitor (usually 1 is primary)
MONITOR_INDEX = 1

# Set capture region (optional)
REGION = {
    "top": 100,         # Y position
    "left": 0,          # X position
    "width": 1920,
    "height": 980
}

# OCR loop
def main():
    with mss.mss() as sct:
        monitor = sct.monitors[MONITOR_INDEX]
        print("Starting screen OCR... Press Ctrl+C to stop.")

        last_text = ""
        
        try:
            while True:
                screenshot = sct.grab(REGION if REGION else monitor)
                frame = np.array(screenshot)

                # Preprocess: grayscale.
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

                # Thresholding to improve OCR accuracy.
                gray = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)[1]

                # OCR.
                text = pytesseract.image_to_string(gray)

                if ratio(text, last_text) < 0.95:
                    
                    # Save text for comparison.
                    last_text = text

                    # Output the result.
                    print("-" * 40)
                    print(text.strip())

                # Wait a moment (throttle capture rate).
                time.sleep(1)

        except KeyboardInterrupt:
            print("OCR stopped.")

if __name__ == "__main__":
    main()

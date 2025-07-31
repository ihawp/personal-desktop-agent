import mss
import numpy as np
import cv2
import pytesseract
import time
from Levenshtein import ratio
# import os
# print(os.environ)
# something = os.getenv("SOMETHING", "")

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def main():

    with mss.mss() as sct:
        print(f"Detected monitors: {len(sct.monitors)-1}")  # monitors[0] is all combined.

        print(f"wow {"cool"}")

        last_texts = {}  # Store last text per monitor.

        print("Starting screen OCR... Press Ctrl+C to stop.")

        try:
            while True:
                for i, monitor in enumerate(sct.monitors[1:], start=1):  # skip monitors[0], full screen.
                    # Use full monitor area or define a REGION here if you want a crop.
                    region = {
                        "top": monitor["top"],
                        "left": monitor["left"],
                        "width": monitor["width"],
                        "height": monitor["height"]
                    }

                    screenshot = sct.grab(region)
                    frame = np.array(screenshot)

                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    gray = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)[1]

                    text = pytesseract.image_to_string(gray)

                    # Compare with previous OCR text for this monitor.
                    if i not in last_texts or ratio(text, last_texts[i]) < 0.95:
                        last_texts[i] = text
                        print(f"--- Monitor {i} ---")
                        print(text.strip())
                        print("-" * 40)

                time.sleep(1)

        except KeyboardInterrupt:
            print("OCR stopped.")

        except:
            print("OCR def stopped.")

if __name__ == "__main__":
    main()
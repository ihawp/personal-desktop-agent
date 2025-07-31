from pynput import keyboard
import threading
import time

buffer = []
BUFFER_LIMIT = 20
lock = threading.Lock()

def on_press(key):
    global buffer

    try:
        char = key.char if hasattr(key, 'char') and key.char is not None else ''
    except Exception:
        char = ''
    with lock:
        if char:
            buffer.append(char)
            if len(buffer) >= BUFFER_LIMIT:
                send_context(''.join(buffer))
                buffer = []  # reset buffer after sending

def send_context(context):
    print(context)
    # You would call your AI API or processing function here

listener = keyboard.Listener(on_press=on_press)
listener.start()

# Keep the script alive
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    listener.stop()
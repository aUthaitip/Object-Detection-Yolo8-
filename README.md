# Object-Detection-Yolo8-
🖼️ Object Detection Project (YOLOv8)
Object Detection Project is a Python application that uses YOLOv8 to detect objects and people in real-time via your webcam.
It highlights objects in video frames with bounding boxes and labels.
🚀 Features
🎯 Real-Time Object Detection – Detect people and objects live from your webcam.
🏷️ Bounding Boxes & Labels – Each detected object is highlighted with a box and a label.
📊 Multiple Objects – Supports detecting several objects in the same frame.
💻 Cross-Platform – Works on macOS, Windows, or Linux with PyTorch support.
🧠 Tech Stack
Language: Python 3.14+
Libraries:
OpenCV – Capture webcam video and draw boxes
Ultralytics YOLOv8 – Object detection
Matplotlib – Visualization
Framework: PyTorch (for YOLOv8)
⚙️ Installation & Run
# Clone this repository
git clone https://github.com/aUthaitip/Object-Detection-Yolo8-.git

# Navigate to project folder
cd Object-Detection-Yolo8-

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate   # macOS / Linux
# .venv\Scripts\activate    # Windows

# Upgrade pip and install dependencies
python3 -m pip install --upgrade pip
pip install opencv-python ultralytics matplotlib

# Run the application
python3 object_detection.py
⚠️ Note:
On macOS with M1/M2/M3 chips, you can run YOLOv8 on the MPS device by setting device='mps' when loading the model.
🧩 Project Structure


Object-Detection-Yolo8-/
├── object_detection.py     # Main application
├── yolov8n.pt              # Pretrained YOLOv8 model weights
├── requirements.txt        # Python dependencies
├── .venv/                  # Virtual environment (ignored in Git)
└── README.md               # Project documentation



📸 Screenshots
Add screenshots of detected objects here (webcam or sample images)
💡 Future Improvements
🎥 Record detection video automatically
🖥️ Add GUI interface for easier use
🔄 Support multiple cameras dynamically
🏃‍♂️ Add object tracking for moving objects
👩‍💻 About Me
Hi! I’m Ice, a 4th-year Computer Science student at Rangsit University.
I’m passionate about backend development and real-world tech solutions.
This repository demonstrates my work in computer vision and AI, and I will keep updating it with new projects. 🚀

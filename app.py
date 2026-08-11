import cv2
import time
import torch
import os
import math
from flask import Flask, Response, jsonify, send_from_directory, request
import numpy as np
from ultralytics import YOLO

app = Flask(__name__, static_folder='frontend/dist', static_url_path='')
app.secret_key = "yolov8-secret-key-dynamic"

# เลือก Device สำหรับประมวลผล (GPU/MPS/CPU)
device = "mps" if torch.backends.mps.is_available() else "cuda" if torch.backends.is_available() else "cpu"
model = YOLO("yolov8n.pt").to(device)

# เตรียมโฟลเดอร์สำหรับเซฟภาพ
output_dir = "saved_images"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# เตรียมโฟลเดอร์สำหรับเซฟวิดีโอ
video_dir = "saved_videos"
if not os.path.exists(video_dir):
    os.makedirs(video_dir)

# ตัวแปรสำหรับการบันทึกวิดีโอ
is_recording = False
video_writer = None
video_out_path = ""

# กล้องตัวหลัก
camera = None

def get_camera():
    global camera
    if camera is None or not camera.isOpened():
        camera = cv2.VideoCapture(1)
        if not camera.isOpened():
            camera = cv2.VideoCapture(0)
    return camera

def release_camera():
    global camera
    if camera is not None:
        camera.release()
        camera = None

def apply_sepia(img):
    kernel = np.array([[0.272, 0.534, 0.131],
                       [0.349, 0.686, 0.168],
                       [0.393, 0.769, 0.189]])
    sepia = cv2.transform(img, kernel)
    return np.clip(sepia, 0, 255).astype(np.uint8)

def apply_grayscale(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

def apply_negative(img):
    return cv2.bitwise_not(img)

def generate_frames(filter_name='normal'):
    global is_recording, video_writer, video_out_path
    cap = get_camera()
    prev_time = 0
    while True:
        success, frame = cap.read()
        if not success:
            break
        
        # ปรับขนาดเฟรมเพื่อให้แสดงบนเว็บได้เร็วขึ้น
        frame_resized = cv2.resize(frame, (640, 480))
        if filter_name == 'vintage':
            frame_resized = apply_sepia(frame_resized)
        elif filter_name == 'grayscale':
            frame_resized = apply_grayscale(frame_resized)
        elif filter_name == 'negative':
            frame_resized = apply_negative(frame_resized)
        
        # คำนวณ FPS
        curr_time = time.time()
        fps = 1 / (curr_time - prev_time) if prev_time != 0 else 0
        prev_time = curr_time

        # 1. โหมด YOLOv8 ตรวจจับวัตถุปกติ
        results = model.predict(frame_resized, stream=True, verbose=False, device=device)
        class_counts = {}

        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                name = model.names[cls]
                label = f"{name} {conf:.2f}"

                class_counts[name] = class_counts.get(name, 0) + 1

                # วาดกรอบและข้อความสีแดง
                cv2.rectangle(frame_resized, (x1, y1), (x2, y2), (38, 38, 220), 2)
                cv2.putText(frame_resized, label, (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (38, 38, 220), 2)

        # แสดง FPS และสถานะจำนวนวัตถุ
        info_text = f"FPS: {fps:.1f}"
        if class_counts:
            detected_items = ", ".join([f"{k}: {v}" for k, v in class_counts.items()])
            info_text += f" | {detected_items}"
        else:
            info_text += " | No objects detected"

        # แถบแสดงสถานะสีดำโปร่งแสง
        cv2.rectangle(frame_resized, (0, 0), (640, 35), (15, 23, 42), -1)
        cv2.putText(frame_resized, info_text, (10, 22),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (248, 250, 252), 1, cv2.LINE_AA)

        # เขียนเฟรมลงวิดีโอถ้าเปิดโหมดบันทึกอยู่
        if is_recording and video_writer is not None:
            video_writer.write(frame_resized)

        # เข้ารหัสภาพเป็น JPEG เพื่อส่งไปยังหน้าเว็บ
        ret, buffer = cv2.imencode('.jpg', frame_resized)
        frame_bytes = buffer.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def index():
    # เสิร์ฟหน้าจอหลักของ React App
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/video_feed')
def video_feed():
    # สตรีมวิดีโอจากกล้องเว็บแคม (รองรับฟิลเตอร์วิดีโอแบบไดนามิก)
    filter_name = request.args.get('filter', 'normal').lower()
    return Response(generate_frames(filter_name=filter_name), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/capture')
def capture():
    # บันทึกภาพหน้าจอ (รองรับฟิลเตอร์)
    filter_name = request.args.get('filter', 'normal').lower()
    cap = get_camera()
    success, frame = cap.read()
    if success:
        timestamp = time.strftime("%Y%m%d-%H%M%S")
        filename = f"detection_{timestamp}.jpg"
        filepath = os.path.join(output_dir, filename)
        
        # รัน YOLO อีกครั้งเพื่อบันทึกรูปพร้อมกรอบ
        frame_resized = cv2.resize(frame, (640, 480))
        if filter_name == 'vintage':
            frame_resized = apply_sepia(frame_resized)
        elif filter_name == 'grayscale':
            frame_resized = apply_grayscale(frame_resized)
        elif filter_name == 'negative':
            frame_resized = apply_negative(frame_resized)
        results = model.predict(frame_resized, stream=True, verbose=False, device=device)
        for r in results:
            for box in r.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                label = f"{model.names[cls]} {conf:.2f}"
                cv2.rectangle(frame_resized, (x1, y1), (x2, y2), (38, 38, 220), 2)
                cv2.putText(frame_resized, label, (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (38, 38, 220), 2)

        cv2.imwrite(filepath, frame_resized)
        return jsonify({"status": "success", "filename": filename})
    return jsonify({"status": "error", "message": "Failed to capture frame"})

@app.route('/screenshots')
def list_screenshots():
    # แสดงรูปทั้งหมดที่เคยเซฟไว้
    files = [f for f in os.listdir(output_dir) if f.endswith('.jpg')]
    files.sort(reverse=True)
    return jsonify(files)

@app.route('/saved_images/<filename>')
def get_screenshot(filename):
    return send_from_directory(output_dir, filename)

@app.route('/delete_image/<filename>')
def delete_image(filename):
    filepath = os.path.join(output_dir, filename)
    if os.path.exists(filepath):
        try:
            os.remove(filepath)
            return jsonify({"status": "success", "message": "File deleted"})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)})
    return jsonify({"status": "error", "message": "File not found"})

@app.route('/stop_camera')
def stop_camera():
    global is_recording, video_writer
    # ถ้ามีการอัดวิดีโอค้างไว้ให้ปิดก่อน
    if is_recording:
        is_recording = False
        if video_writer is not None:
            video_writer.release()
            video_writer = None
    release_camera()
    return jsonify({"status": "camera released"})

@app.route('/start_recording')
def start_recording():
    global is_recording, video_writer, video_out_path
    if not is_recording:
        timestamp = time.strftime("%Y%m%d-%H%M%S")
        filename = f"detection_{timestamp}.mp4"
        video_out_path = os.path.join(video_dir, filename)
        
        # ใช้ codec mp4v สำหรับไฟล์ .mp4
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        # ความกว้าง 640 สูง 480 เฟรมเรต 20 FPS
        video_writer = cv2.VideoWriter(video_out_path, fourcc, 20.0, (640, 480))
        is_recording = True
        return jsonify({"status": "success", "filename": filename})
    return jsonify({"status": "error", "message": "Already recording"})

@app.route('/stop_recording')
def stop_recording():
    global is_recording, video_writer, video_out_path
    if is_recording:
        is_recording = False
        if video_writer is not None:
            video_writer.release()
            video_writer = None
        filename = os.path.basename(video_out_path)
        return jsonify({"status": "success", "filepath": video_out_path, "filename": filename})
    return jsonify({"status": "error", "message": "Not recording"})

@app.route('/recording_status')
def recording_status():
    global is_recording
    return jsonify({"is_recording": is_recording})

@app.route('/download_image/<filename>')
def download_image(filename):
    return send_from_directory(output_dir, filename, as_attachment=True)

@app.route('/saved_videos/<filename>')
def get_video(filename):
    return send_from_directory(video_dir, filename)

# จบการลบส่วนของเกมวาดภาพ

@app.route('/download_video/<filename>')
def download_video(filename):
    return send_from_directory(video_dir, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

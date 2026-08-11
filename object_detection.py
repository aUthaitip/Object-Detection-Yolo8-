import cv2
import time
import torch
from ultralytics import YOLO
import os

# 1. เลือก Device สำหรับประมวลผล (รองรับ GPU/MPS บน Mac M1/M2/M3 และ CUDA สำหรับ Windows/Linux)
if torch.backends.mps.is_available():
    device = "mps"
    print("🚀 ใช้ GPU: Apple Silicon (MPS)")
elif torch.cuda.is_available():
    device = "cuda"
    print("🚀 ใช้ GPU: CUDA")
else:
    device = "cpu"
    print("💻 ใช้ CPU")

# โหลด Model YOLOv8 และย้ายไปใช้งานบน Device ที่เลือก
model = YOLO("yolov8n.pt").to(device)

# เตรียมโฟลเดอร์สำหรับบันทึกรูปภาพหน้าจอ
output_dir = "saved_images"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# เริ่มต้นกล้อง (ลอง index 1 ก่อน หากล้มเหลวจะลอง index 0 แทน)
cap = cv2.VideoCapture(1)
if not cap.isOpened():
    print("⚠️ ไม่สามารถเปิดกล้อง index 1 ได้ กำลังทดลองใช้ index 0...")
    cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("❌ ไม่สามารถเปิดกล้องได้")
    exit()

print("✅ เริ่มตรวจจับวัตถุแล้ว...")
print("⌨️ ปุ่มควบคุม:")
print("   - กด 'q' เพื่อออกจากโปรแกรม")
print("   - กด 's' เพื่อบันทึกภาพหน้าจอที่ตรวจจับได้")

# ตัวแปรสำหรับคำนวณ FPS
prev_time = 0

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ ไม่สามารถอ่านภาพจากกล้องได้")
        break

    # ปรับขนาดภาพเพื่อให้ทำงานได้รวดเร็วขึ้น
    frame_resized = cv2.resize(frame, (640, 480))
    
    # คำนวณความเร็ว FPS
    curr_time = time.time()
    fps = 1 / (curr_time - prev_time) if prev_time != 0 else 0
    prev_time = curr_time

    # ตรวจจับวัตถุ (ปิด verbose เพื่อไม่ให้ log รกหน้าจอ terminal)
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

            # นับจำนวนของวัตถุแต่ละประเภทที่ตรวจพบในเฟรมนี้
            class_counts[name] = class_counts.get(name, 0) + 1

            # วาดกรอบสี่เหลี่ยมรอบวัตถุและแสดงป้ายชื่อ
            cv2.rectangle(frame_resized, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame_resized, label, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    # จัดการข้อความที่จะแสดงผลบนแถบข้อมูลด้านบนสุด
    info_text = f"FPS: {fps:.1f}"
    if class_counts:
        detected_items = ", ".join([f"{k}: {v}" for k, v in class_counts.items()])
        info_text += f" | {detected_items}"
    else:
        info_text += " | No objects detected"
    
    # วาดแถบดำโปร่งแสงเป็นพื้นหลังให้กับข้อมูล FPS และจำนวนวัตถุ
    cv2.rectangle(frame_resized, (0, 0), (640, 35), (0, 0, 0), -1)
    cv2.putText(frame_resized, info_text, (10, 22),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)

    cv2.imshow("Object Detection (Press Q to quit, S to save)", frame_resized)
    
    # ตรวจจับการกดปุ่มบนแป้นพิมพ์
    key = cv2.waitKey(1) & 0xFF
    if key == ord("q"):
        break
    elif key == ord("s"):
        # บันทึกภาพหน้าจอ
        timestamp = time.strftime("%Y%m%d-%H%M%S")
        filename = os.path.join(output_dir, f"detection_{timestamp}.jpg")
        cv2.imwrite(filename, frame_resized)
        print(f"📸 บันทึกรูปภาพสำเร็จ: {filename}")

cap.release()
cv2.destroyAllWindows()

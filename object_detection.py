import cv2
from ultralytics import YOLO

model = YOLO("yolov8n.pt")

cap = cv2.VideoCapture(1)

if not cap.isOpened():
    print("❌ ไม่สามารถเปิดกล้องได้")
    exit()

print("✅ เริ่มตรวจจับวัตถุแล้ว... กด Q เพื่อออก")

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ ไม่สามารถอ่านภาพจากกล้องได้")
        break

    frame_resized = cv2.resize(frame, (640, 480))

    results = model.predict(frame_resized, stream=True)

    for r in results:
        boxes = r.boxes
        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])  #
            cls = int(box.cls[0])  
            conf = float(box.conf[0]) 
            label = f"{model.names[cls]} {conf:.2f}"

       
            cv2.rectangle(frame_resized, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame_resized, label, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    cv2.imshow("Object Detection (Press Q to quit)", frame_resized)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()

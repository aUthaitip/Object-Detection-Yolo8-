export interface TranslationData {
  title: string;
  nav_brand: string;
  hero_title: string;
  hero_desc: string;
  start_btn: string;
  features_title: string;
  feat_rt_title: string;
  feat_rt_desc: string;
  feat_model_title: string;
  feat_model_desc: string;
  feat_snap_title: string;
  feat_snap_desc: string;
  about_title: string;
  about_intro: string;
  about_desc: string;
  camera_title: string;
  back_home: string;
  btn_capture: string;
  btn_start_record: string;
  btn_stop_record: string;
  btn_vintage: string;
  panel_shortcuts: string;
  shortcut_snap: string;
  shortcut_back: string;
  panel_gallery: string;
  gallery_empty: string;
  alert_save_success: string;
  alert_save_fail: string;
  alert_rec_start: string;
  alert_rec_stop: string;
  btn_delete: string;
  alert_delete_success: string;
  alert_delete_fail: string;
  confirm_delete: string;

  // Multi-filter
  label_filter: string;
  filter_normal: string;
  filter_vintage: string;
  filter_grayscale: string;
  filter_negative: string;
}

export const TRANSLATIONS: Record<'th' | 'en', TranslationData> = {
  th: {
    title: "ระบบตรวจจับวัตถุ YOLOv8",
    nav_brand: "YOLOv8 Vision",
    hero_title: "ระบบตรวจจับวัตถุแบบเรียลไทม์ ด้วย YOLOv8 🚀",
    hero_desc: "ยินดีต้อนรับสู่เว็บแอปพลิเคชันตรวจจับวัตถุผ่านกล้อง Webcam ด้วยประสิทธิภาพของโมเดล AI ระดับโลก (YOLOv8) ที่พัฒนาโดย Ultralytics ตรวจจับ คัดกรอง และประมวลผลได้อย่างรวดเร็วและแม่นยำ",
    start_btn: "▶️ เริ่มต้นใช้งานกล้อง",
    features_title: "คุณสมบัติระบบ (System Features)",
    feat_rt_title: "ตรวจจับเรียลไทม์ (Real-Time)",
    feat_rt_desc: "ตรวจจับวัตถุและวิเคราะห์เฟรมวิดีโอจากกล้องเว็บแคมของคุณทันทีด้วยความเร็วสูง",
    feat_model_title: "โมเดล YOLOv8 Nano",
    feat_model_desc: "รันโมเดล YOLOv8n ที่มีขนาดเล็ก เบา และประมวลผลรวดเร็วแต่ยังคงความแม่นยำที่ดี",
    feat_snap_title: "บันทึกภาพหน้าจอทันที",
    feat_snap_desc: "สามารถกดถ่ายรูปบันทึกผลการตรวจจับ (พร้อมกรอบ Bounding Box) ลงเครื่องได้ทันที",
    about_title: "เกี่ยวกับผู้พัฒนา (About Me)",
    about_intro: "สวัสดีครับ! ผมชื่อ Ice นักศึกษาชั้นปีที่ 4 คณะวิทยาศาสตร์คอมพิวเตอร์ มหาวิทยาลัยรังสิต",
    about_desc: "มีความสนใจและมุ่งมั่นในด้าน Backend Development และการนำ AI/Computer Vision มาสร้างโซลูชันที่ใช้ได้จริงในชีวิตประจำวัน",
    camera_title: "YOLOv8 Live Camera - กล้องตรวจจับวัตถุ",
    back_home: "⬅️ ย้อนกลับหน้าแรก",
    btn_capture: "📸 ถ่ายภาพหน้าจอ (Save Screenshot)",
    btn_start_record: "⏺️ เริ่มอัดวิดีโอ (Start Record)",
    btn_stop_record: "⏹️ หยุดอัดวิดีโอ (Stop & Save)",
    btn_vintage: "🎞️ ฟิลเตอร์วินเทจ (Vintage Mode)",
    panel_shortcuts: "⌨️ คีย์บอร์ดควบคุม",
    shortcut_snap: "ถ่ายภาพ (S)",
    shortcut_back: "กลับหน้าแรก (Q)",
    panel_gallery: "🖼️ คลังรูปภาพที่เซฟไว้",
    gallery_empty: "ยังไม่มีรูปที่เซฟไว้",
    alert_save_success: "📸 บันทึกรูปภาพสำเร็จ:",
    alert_save_fail: "❌ ไม่สามารถบันทึกภาพได้:",
    alert_rec_start: "⏺️ เริ่มต้นการอัดวิดีโอแล้ว...",
    alert_rec_stop: "⏹️ บันทึกวิดีโอสำเร็จ!",
    btn_delete: "🗑️ ลบ (Delete)",
    alert_delete_success: "🗑️ ลบสำเร็จเรียบร้อยแล้ว",
    alert_delete_fail: "❌ ไม่สามารถลบไฟล์ได้:",
    confirm_delete: "คุณต้องการลบรูปภาพนี้ใช่หรือไม่?",

    // Filters
    label_filter: "🎨 เลือกฟิลเตอร์:",
    filter_normal: "ปกติ (Normal)",
    filter_vintage: "วินเทจ (Vintage)",
    filter_grayscale: "ขาวดำ (Grayscale)",
    filter_negative: "สีตรงข้าม (Negative)"
  },
  en: {
    title: "YOLOv8 Object Detection System",
    nav_brand: "YOLOv8 Vision",
    hero_title: "Real-Time Object Detection with YOLOv8 🚀",
    hero_desc: "Welcome to the real-time webcam object detection web application powered by the world-class AI model (YOLOv8) developed by Ultralytics. Fast, accurate, and seamless detection.",
    start_btn: "▶️ Start Detection Camera",
    features_title: "System Features",
    feat_rt_title: "Real-Time Detection",
    feat_rt_desc: "Instantly detect objects and analyze webcam video frames at high speed.",
    feat_model_title: "YOLOv8 Nano Model",
    feat_model_desc: "Runs the lightweight YOLOv8n model, designed for speed and good accuracy.",
    feat_snap_title: "Instant Screenshot",
    feat_snap_desc: "Quickly take screenshots of detection results (with bounding boxes) and save them instantly.",
    about_title: "About The Developer",
    about_intro: "Hi! I'm Ice, a 4th-year Computer Science student at Rangsit University.",
    about_desc: "Passionate about backend development and bringing AI/Computer Vision solutions to life.",
    camera_title: "YOLOv8 Live Camera",
    back_home: "⬅️ Back to Home",
    btn_capture: "📸 Capture Screenshot",
    btn_start_record: "⏺️ Start Recording",
    btn_stop_record: "⏹️ Stop Recording",
    btn_vintage: "🎞️ Vintage Mode",
    panel_shortcuts: "⌨️ Keyboard Controls",
    shortcut_snap: "Take Photo (S)",
    shortcut_back: "Back to Home (Q)",
    panel_gallery: "🖼️ Saved Screenshots",
    gallery_empty: "No screenshots saved yet",
    alert_save_success: "📸 Screenshot saved successfully:",
    alert_save_fail: "❌ Failed to save screenshot:",
    alert_rec_start: "⏺️ Video recording started...",
    alert_rec_stop: "⏹️ Video saved successfully!",
    btn_delete: "🗑️ Delete",
    alert_delete_success: "🗑️ File deleted successfully",
    alert_delete_fail: "❌ Failed to delete file:",
    confirm_delete: "Are you sure you want to delete this image?",

    // Filters
    label_filter: "🎨 Select Filter:",
    filter_normal: "Normal",
    filter_vintage: "Vintage (Sepia)",
    filter_grayscale: "Grayscale",
    filter_negative: "Negative"
  }
};

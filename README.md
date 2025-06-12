# 📚 โครงงาน TALEDGE — ชั้นวางเรื่องราว

**รหัสโครงงาน:** 67-1_38_skn-r2  
**ชื่อโครงงาน (ไทย):** ชั้นวางเรื่องราว  
**ชื่อโครงงาน (อังกฤษ):** TALEDGE  
**อาจารย์ที่ปรึกษาโครงงาน:** อาจารย์ สิริกันยา นิลพานิช  

---

## 👨‍💻 ผู้จัดทำโครงงาน

- นาย สิรวิชญ์ ทิมสุวรรณ | 6309682067 | sirawich.tim@dome.tu.ac.th  
- นางสาว ณิชาภัทร ชมภูน้อย | 6309610134 | nichapat.cho@dome.tu.ac.th  

---

## 📦 โครงสร้างโปรเจกต์

project/
├── server/
│ ├── app.py
│ ├── .env
│ ├── models/
│ ├── routes/
│ └── uploads/
├── src/
│ ├── pages/
│ ├── components/
│ ├── assets/
│ └── App.js, index.js
├── public/
├── venv/
├── package.json
├── README.md
├── CS369_Report_Group11.pdf

yaml
คัดลอก
แก้ไข

---

## ⚙️ โปรแกรมที่จำเป็น

- Node.js v18+
- MongoDB (Local หรือ MongoDB Atlas)
- Python 3.9+ (ใช้กับระบบ dictionary)
- Git

---

## 🔧 วิธีติดตั้ง

### 1. Clone โปรเจกต์

```bash
git clone https://github.com/ComSciThammasatU/2567-2-cs403-final-submission-67-1_38_skn-r2.git
cd 2567-2-cs403-final-submission-67-1_38_skn-r2/project
2. ติดตั้งและรัน Backend (Node.js + Python)
bash
คัดลอก
แก้ไข
cd server
npm install

# สร้าง Python virtual environment
python -m venv venv
venv\Scripts\activate  # บน Windows

# ติดตั้งไลบรารีที่ต้องใช้
pip install pythainlp nltk flask
python -m nltk.downloader omw-1.4

# เริ่มเซิร์ฟเวอร์ backend
node app.js
📄 .env ตัวอย่าง:

ini
คัดลอก
แก้ไข
MONGODB_URI=mongodb://localhost:27017/taledge
PORT=5000
3. ติดตั้งและรัน Frontend
bash
คัดลอก
แก้ไข
cd ../src
npm install
npm start
แล้วเปิด http://localhost:3000

🧭 วิธีใช้งานระบบ
สมัครสมาชิก / ล็อกอินที่หน้า Home.js

สร้างโปรเจกต์ใหม่ที่ CreateProject.js

เข้าสู่หน้า Editor (EditorLayout.js) ซึ่งมีเมนูด้านซ้ายหลายหมวด

✨ ส่วนประกอบสำคัญ
หน้า	หน้าที่
NewCharacter.js	สร้างตัวละคร
ClanSubfiction.js	สร้างกลุ่มตัวละคร (แคลน)
RelationshipEditor.js	วาดกราฟความสัมพันธ์
WorldPanel.js	สร้างโลกของนิยาย
ItemsPanel.js	เก็บไอเท็มในเรื่อง
ManuscriptPanel.js	เขียนบทนิยาย
Chapter.js	รวมทุกบท
TimelinePanel.js	สร้างลำดับเหตุการณ์
ResearchPanel.js	เก็บแหล่งข้อมูล PDF, วิดีโอ

🧩 Backend API Routes
อยู่ที่ server/routes/ เช่น:

/auth, /character, /group, /timeline, /relationship

/item, /system, /world, /manuscript, /notepad, /research

เชื่อมกับ Schema ใน server/models/ เช่น:

Character.js, TimelineEvent.js, World.js, SystemHierarchy.js

📌 Topics
Topic 1: ระบบจัดการตัวละครและกลุ่ม (Characters & Clans)

Topic 2: ระบบเขียนบทและไทม์ไลน์

Topic 3: ระบบ Tree/Graph สำหรับโลกและความสัมพันธ์

📄 ไฟล์นี้ใช้ประกอบการส่งงานโครงงานวิชา คพ.403 ภาคปลาย ปี 2567
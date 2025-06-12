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
├── server/                  # ✅ Backend Node.js + Python
│   ├── app.py              # API สำหรับพจนานุกรม (Python)
│   ├── .env                # Environment variables (Mongo URI)
│   ├── models/             # MongoDB Schemas เช่น Character, Manuscript, etc.
│   ├── routes/             # REST API routes (12 กลุ่ม)
│   └── uploads/            # ไฟล์ที่ผู้ใช้อัปโหลด
├── src/                    # ✅ React Frontend
│   ├── pages/              # 35 หน้า UI เช่น ManuscriptPanel, TimelinePanel
│   ├── components/         # ส่วนย่อยเช่น Footer, TutorialModal
│   ├── assets/             # ไฟล์ภาพ
│   └── App.js, index.js
├── public/                 # favicon, manifest, index.html
├── venv/                   # Python virtual environment
├── package.json            # Node dependencies
├── README.md               # คู่มือโครงการ (ไฟล์นี้)
├── CS369_Report_Group11.pdf


---

## ⚙️ โปรแกรมที่จำเป็น

- Node.js v18+
- MongoDB (Local หรือ MongoDB Atlas)
- Python 3.9+ (สำหรับ dictionary API)
- Git

---

## 🔧 วิธีติดตั้ง

### 1. Clone โปรเจกต์
bash
git clone https://github.com/Guyzaza18121/cs403-taledge.git

cd taledge/project


### 2. ติดตั้งและรัน Backend (Node.js + Python)
bash
cd server
npm install
# Python virtual env
python -m venv venv
venv\Scripts\activate  # บน Windows
pip install pythainlp nltk flask
python -m nltk.downloader omw-1.4
node app.js


📄 .env ตัวอย่าง
MONGODB_URI=mongodb://localhost:27017/taledge
PORT=5000


### 3. ติดตั้งและรัน Frontend
bash
cd ../src
npm install
npm start

แล้วเปิด [http://localhost:3000](http://localhost:3000)

---

## 🧭 วิธีใช้งานระบบ

1. สมัครสมาชิก / ล็อกอินที่หน้า Home.js
2. สร้างโปรเจกต์ใหม่จาก CreateProject.js
3. เข้าสู่หน้า Editor (EditorLayout.js) ซึ่งมี sidebar ด้านซ้ายแยกเป็นหมวดต่าง ๆ

### ✨ ส่วนประกอบสำคัญ

| หน้าหลัก | รายละเอียด |
|----------|-------------|
| NewCharacter.js | สร้างตัวละคร ใส่รูป ลิงก์ นิสัย |
| ClanSubfiction.js | สร้างกลุ่มตัวละคร (แคลน) |
| RelationshipEditor.js | วาดกราฟความสัมพันธ์ (drag & drop) |
| WorldPanel.js | สร้างข้อมูลเกี่ยวกับโลก นิยาย |
| ItemsPanel.js | จัดการไอเท็ม เช่น หนังสือ อุปกรณ์ |
| ManuscriptPanel.js | เขียนบทนิยาย แบ่งเป็นบท |
| Chapter.js | รวมบททั้งหมดที่เขียน |
| TimelinePanel.js | จัดลำดับเวลาเรื่อง |
| ResearchPanel.js | เก็บลิงก์/วิดีโอ/PDF สำหรับค้นคว้า |

---

## 🧩 Backend API Routes

ใน server/routes/ มีทั้งหมด 12 route เช่น:
- /auth, /character, /group, /timeline, /relationship
- /research, /system, /manuscript, /notepad, /item, /world

เชื่อมโยงกับ server/models/ ที่มี Schema เช่น:
- Character.js, TimelineEvent.js, SystemHierarchy.js, World.js

---

## 📌 Topics

**Topic 1:** ระบบจัดการตัวละครและความสัมพันธ์ (Character & Clan)  
**Topic 2:** ระบบเขียนนิยายและบทแบบมี Timeline  
**Topic 3:** ระบบโครงสร้างโลกและระบบย่อยแบบ Tree/Graph

---

📄 *ไฟล์นี้ใช้ประกอบการส่งงานโครงงาน CS403 ภาคปลาย ปี 2567*
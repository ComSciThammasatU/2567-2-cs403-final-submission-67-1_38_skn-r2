# 📚 TALEDGE — ชั้นวางเรื่องราว

> ระบบจัดการการเขียนนิยายที่รวมเครื่องมือด้านตัวละคร โครงเรื่อง และความสัมพันธ์เข้าไว้ในที่เดียว

---

## 📖 รายละเอียดโครงการ

**ชื่อโครงงาน (ไทย):** ชั้นวางเรื่องราว  
**ชื่อโครงงาน (อังกฤษ):** TALEDGE  
**รหัสโครงงาน:** 67-1_38_skn-r2  
**อาจารย์ที่ปรึกษา:** อาจารย์ สิริกันยา นิลพานิช  

Taledge เป็นแพลตฟอร์มสำหรับนักเขียนนิยาย ที่ให้คุณสามารถ:

- สร้างตัวละครและแคลน
- วาดความสัมพันธ์แบบกราฟ
- จัดการฉาก โลก ไอเท็ม และบทนิยาย
- เชื่อมโยงข้อมูลต่าง ๆ เข้าด้วยกันในรูปแบบของระบบช่วยเขียนที่เป็นระบบ

---

## 🎯 Features

- 👤 สร้างตัวละคร พร้อมภาพ ลิงก์ นิสัย
- 🧬 เชื่อมโยงตัวละครในกราฟความสัมพันธ์
- 🌍 สร้างระบบโลกแบบ Tree/Hierarchy
- 🗓 จัดลำดับเวลาแบบ Timeline
- 📝 เขียนบทนิยายในรูปแบบ Markdown
- 📦 เก็บไอเท็ม, ภาพ, ไฟล์ค้นคว้า
- 🔐 ระบบล็อกอิน/สมัครสมาชิก

---

## 🧰 Technologies Used

| Tech | Purpose |
|------|--------|
| React.js | Frontend SPA |
| Node.js + Express | Backend API |
| MongoDB | Database |
| Python (Flask) | Dictionary API (pythainlp + nltk) |
| React Flow | วาดความสัมพันธ์แบบ drag & drop |
| CSS Modules + Tailwind | UI Design |

---

## 🖥 Screenshots

### 🔍 ภาพรวมระบบ
![Editor](./screenshots/Editor.png) 

### 🧩 ความสัมพันธ์ตัวละคร
![Relationships](./screenshots/Relationships.png) 

### ✍️ เขียนบทนิยาย
![Manuscript](./screenshots/Manuscript.png) 

### 🗓 หน้ารวมตัวละครต่างๆ 
![Character](./screenshots/Character.png)

### 🌍 ระบบโลกและไอเท็ม
![world](./screenshots/world.png)

---

## 🚀 วิธีติดตั้ง

### 1. Clone โปรเจกต์

```bash
git clone https://github.com/ComSciThammasatU/2567-2-cs403-final-submission-67-1_38_skn-r2.git
cd 2567-2-cs403-final-submission-67-1_38_skn-r2/project

2. Backend (Node + Python)
cd server
npm install
python -m venv venv
venv\Scripts\activate
pip install pythainlp nltk flask
python -m nltk.downloader omw-1.4
node app.js


.env ตัวอย่าง:
MONGODB_URI=mongodb://localhost:27017/taledge
PORT=5000

3. Frontend
cd ../src
npm install
npm start


###💡 วิธีใช้งาน

1. เปิด http://localhost:3000

2. สมัครสมาชิก → สร้างโปรเจกต์

3. เลือกใช้งานเครื่องมือด้านซ้ายมือ เช่น:

- 🧍 ตัวละคร  
    
- 🌐 โลก

- ⏳ ไทม์ไลน์

- 🧾 บทนิยาย

📂 โครงสร้างโปรเจกต์

project/
├── server/
│   ├── app.py, models/, routes/
├── src/
│   ├── pages/, components/
├── public/
├── venv/
├── package.json

###👨‍👩‍👧‍👦 ผู้จัดทำ
```bash
- นาย สิรวิชญ์ ทิมสุวรรณ — sirawich.tim@dome.tu.ac.th

- นางสาว ณิชาภัทร ชมภูน้อย — nichapat.cho@dome.tu.ac.th

📌 ไฟล์นี้ใช้ประกอบการส่งโครงงาน คพ.403 ภาคปลาย ปี 2567
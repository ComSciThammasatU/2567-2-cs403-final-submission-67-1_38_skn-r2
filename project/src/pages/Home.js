import "./Home.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  // Login/Register states
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  // Forgot Password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1=กรอกอีเมล, 2=กรอก OTP, 3=ตั้งรหัสผ่านใหม่
  const [fpMessage, setFpMessage] = useState("");

  // Handlers for Login/Register
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        window.location.reload();
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ สมัครสำเร็จ! ล็อกอินได้เลย");
        setShowRegister(false);
        setShowLogin(true);
      } else {
        setMessage(data.error || "Register failed");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  // Start project
  const handleStart = () => {
    if (token) {
      navigate("/Create");
    } else {
      alert("กรุณาเข้าสู่ระบบก่อน");
    }
  };
  // Forgot Password Handlers
    const [canRequestOtp, setCanRequestOtp] = useState(true);
    const [otpCountdown, setOtpCountdown] = useState(0);
  // 1. ขอ OTP
  const handleRequestOtp = async () => {
    if (!canRequestOtp) return;

    if (!emailForOtp) {
        setFpMessage("กรุณากรอกอีเมล");
        return;
    }
    try {
        const res = await fetch("http://localhost:5000/api/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForOtp }),
        });
        const data = await res.json();
        if (res.ok) {
        setFpMessage("✅ ส่ง OTP ไปยังอีเมลแล้ว");
        setStep(2);
        setCanRequestOtp(false);
        setOtpCountdown(120); // 2 นาที
        } else {
        setFpMessage(data.error || "❌ ส่ง OTP ล้มเหลว");
        }
    } catch {
        setFpMessage("❌ Server error");
    }
    };

  // 2. ยืนยัน OTP
  const handleVerifyOtp = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForOtp, otp }),
        });
        const data = await res.json();
        if (res.ok) {
        setStep(3);
        setFpMessage("✅ OTP ถูกต้อง โปรดตั้งรหัสผ่านใหม่");
        } else {
        setFpMessage(data.error || "❌ OTP ไม่ถูกต้อง");
        }
    } catch {
        setFpMessage("❌ Server error");
    }
    };

  // 3. ตั้งรหัสผ่านใหม่
  const handleResetPassword = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/reset-password-with-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForOtp, otp, newPassword }),
        });
        const data = await res.json();
        if (res.ok) {
        setFpMessage("✅ เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
        setStep(1);
        setEmailForOtp("");
        setOtp("");
        setNewPassword("");
        } else {
        setFpMessage(data.error || "❌ เปลี่ยนรหัสผ่านไม่สำเร็จ");
        }
    } catch {
        setFpMessage("❌ Server error");
    }
    };

    useEffect(() => {
    if (otpCountdown === 0) {
        setCanRequestOtp(true);
        return;
    }
    const timer = setTimeout(() => {
        setOtpCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
    }, [otpCountdown]);

  return (
    <div className="home-wrapper">
      {token && (
        <button
          style={{
            position: "absolute",
            top: 20,
            right: 30,
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundImage: "linear-gradient(135deg, #ff416c, #ff4b2b)",
            fontWeight: "bold",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(0, 0, 0, 0.35)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.25)";
          }}
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      )}

      <div className="home-hero">
        <h1 className="home-title">ชั้นวางเรื่องราว</h1>
        <p className="home-subtitle">เริ่มต้นโปรเจกต์ใหม่</p>

        {token ? (
          <>
            <p
              style={{
                fontSize: "2rem",
                marginBottom: "30px",
                color: "#fff",
                textShadow: `
                  0 0 15px #b184ff,     /* ม่วง */
                  0 0 10px #ffddee,    /* ชมพูอมขาว */
                  0 0 15px #a0ffe6     /* มิ้นท์ */
                `
              }}
            >
              👋 ยินดีต้อนรับ, <strong>{username}</strong>
            </p>

            <div className="home-start-buttons-container">
              <button className="home-start-button primary" onClick={handleStart}>
                🚀เริ่มสร้างโปรเจกต์
              </button>
              <button className="home-start-button secondary" onClick={() => navigate("/projects")}>
                📁เปิดโปรเจกต์ที่เคยสร้าง
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                className={`auth-button ${showLogin ? "active" : ""}`}
                onClick={() => {
                  setShowLogin(true);
                  setShowRegister(false);
                  setShowForgotPassword(false);
                  setMessage("");
                }}
              >
                🔐 Login
              </button>
              <button
                className={`auth-button ${showRegister ? "active" : ""}`}
                onClick={() => {
                  setShowRegister(true);
                  setShowLogin(false);
                  setShowForgotPassword(false);
                  setMessage("");
                }}
              >
                📝 Register
              </button>
            </div>

            {(showLogin || showRegister) && !showForgotPassword && (
              <div className="login-form" style={{ marginTop: "20px", textAlign: "center" }}>
                <input
                  className="auth-input"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <br />
                {showRegister && (
                  <>
                    <input
                      className="auth-input"
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <br />
                  </>
                )}
                <input
                  className="auth-input"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <br />
                <button
                  className="bn33"
                  onClick={showLogin ? handleLogin : handleRegister}
                >
                  {showLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
                </button>

                {showLogin && (
                  <p
                    style={{
                      cursor: "pointer",
                      color: "blue",
                      textDecoration: "underline",
                      marginTop: "10px"
                    }}
                    onClick={() => {
                      setShowForgotPassword(true);
                      setFpMessage("");
                      setStep(1);
                      setEmailForOtp("");
                      setOtp("");
                      setNewPassword("");
                    }}
                  >
                    ลืมรหัสผ่าน?
                  </p>
                )}

                {message && <p style={{ marginTop: "10px", color: "darkred" }}>{message}</p>}
              </div>
            )}

            {/* ฟอร์มลืมรหัสผ่าน */}
            {showForgotPassword && (
              <div className="forgot-password-form" style={{ marginTop: "20px", textAlign: "center" }}>
                
                {step === 1 && (
                  <>
                    <input
                      className="auth-input"
                      type="email"
                      placeholder="กรอกอีเมลของคุณ"
                      value={emailForOtp}
                      onChange={(e) => setEmailForOtp(e.target.value)}
                    />
                    <br />
                    <button className="bn33" onClick={handleRequestOtp}>📨 ส่ง OTP</button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <input
                      className="auth-input"
                      type="text"
                      placeholder="กรอก OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <br />
                    <button
                      className="resend-button"
                      onClick={handleRequestOtp}
                      disabled={!canRequestOtp}
                    >
                      ส่ง OTP อีกครั้ง {canRequestOtp ? "" : `(${otpCountdown}s)`}
                    </button>
                    <br />
                    <button className="bn33" onClick={handleVerifyOtp}>ยืนยัน OTP</button>
                  </>
                )}

                {step === 3 && (
                  <>
                    <input
                      className="auth-input"
                      type="password"
                      placeholder="รหัสผ่านใหม่"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <br />
                    <button className="bn33" onClick={handleResetPassword}>🔒 ตั้งรหัสผ่านใหม่</button>
                  </>
                )}

                {fpMessage && <p style={{ marginTop: "10px", color: "darkred" }}>{fpMessage}</p>}

                <p
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                    marginTop: "15px"
                  }}
                  onClick={() => {
                    setShowForgotPassword(false);
                    setFpMessage("");
                  }}
                >
                  กลับไปหน้าเข้าสู่ระบบ
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="home-features">
        <div className="feature-card">
          <h3>🧍‍♀️ ตัวละคร</h3>
          <p>สร้างและจัดการตัวละครของคุณ พร้อมข้อมูลลึกซึ้ง</p>
        </div>
        <div className="feature-card">
          <h3>📚 งานเขียน</h3>
          <p>เขียนเนื้อหานิยายได้ในแบบเรียลไทม์ พร้อมระบบบันทึกอัตโนมัติ</p>
        </div>
        <div className="feature-card">
          <h3>🌐 เก็บข้อมูลการค้นหา</h3>
          <p>จัดเก็บข้อมูลโลก เรื่องราว สถานที่ และอื่นๆ ได้อย่างเป็นระบบ</p>
        </div>
      </div>
    </div>
  );
}

export default Home;

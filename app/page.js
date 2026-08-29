"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [view, setView] = useState("signin");
  const router = useRouter();

  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ username: "", email: "", password: "" });

  const [signinError, setSigninError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectView = (newView) => {
    setView(newView);
    setSigninError("");
    setSignupError("");
  };

  async function handleSignin(e) {
    e.preventDefault();
    setSigninError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signinData),
      });
      const data = await res.json();

      if (!res.ok) {
        setSigninError(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      setSigninError("Terjadi kesalahan, coba lagi");
      setLoading(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setSignupError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();

      if (!res.ok) {
        setSignupError(data.message || "Registrasi gagal");
        setLoading(false);
        return;
      }

      setLoading(false);
      selectView("signin");
      setSigninData({ email: signupData.email, password: "" });
    } catch (err) {
      setSignupError("Terjadi kesalahan, coba lagi");
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <ul className="card-nav">
        <li>
          <div className="logo">🎵</div>
          <span
            className="active-bar"
            style={{ top: view === "signin" ? "33.33%" : "66.66%" }}
          />
        </li>

        <li>
          <button
            type="button"
            className={view === "signin" ? "signin active" : "signin"}
            onClick={() => selectView("signin")}
          >
            <span>👤</span>
            <span>Sign In</span>
          </button>
        </li>

        <li>
          <button
            type="button"
            className={view === "signup" ? "signup active" : "signup"}
            onClick={() => selectView("signup")}
          >
            <span>👤+</span>
            <span>Sign Up</span>
          </button>
        </li>
      </ul>

      <div className="card-hero">
        <div
          className="card-hero-inner"
          style={{ top: view === "signin" ? "0" : "-100%" }}
        >
          <div className="card-hero-content signin">
            <div className="icon">🔐</div>
            <h2>Welcome Back.</h2>
            <h3>Enter your credentials to continue.</h3>
          </div>

          <div className="card-hero-content signup">
            <div className="icon">✨</div>
            <h2>Create Account.</h2>
            <h3>Join us — it only takes a minute.</h3>
          </div>
        </div>
      </div>

      <div className="card-form">
        <div className="forms" style={{ top: view === "signin" ? "0" : "-100%" }}>
          {/* SIGN IN */}
          <form onSubmit={handleSignin}>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              required
              value={signinData.email}
              onChange={(e) => setSigninData({ ...signinData, email: e.target.value })}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={signinData.password}
              onChange={(e) => setSigninData({ ...signinData, password: e.target.value })}
            />

            {signinError && <p style={{ color: "#ff7ac6", fontSize: 13, margin: 0 }}>{signinError}</p>}

            <div className="switch-line">
              No account yet? <a onClick={() => selectView("signup")}>Sign Up</a>
            </div>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "..." : "SIGN IN"}
            </button>
          </form>

          {/* SIGN UP */}
          <form onSubmit={handleSignup}>
            <label>Username</label>
            <input
              type="text"
              placeholder="yourname"
              required
              value={signupData.username}
              onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              required
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            />

            {signupError && <p style={{ color: "#ff7ac6", fontSize: 13, margin: 0 }}>{signupError}</p>}

            <div className="switch-line">
              Already have an account? <a onClick={() => selectView("signin")}>Sign In</a>
            </div>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "..." : "SIGN UP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
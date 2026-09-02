"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function hitungUsia(tanggalLahir) {
  const lahir = new Date(tanggalLahir);
  const sekarang = new Date();
  let usia = sekarang.getFullYear() - lahir.getFullYear();
  const bulan = sekarang.getMonth() - lahir.getMonth();
  if (bulan < 0 || (bulan === 0 && sekarang.getDate() < lahir.getDate())) {
    usia--;
  }
  return usia;
}

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [biodata, setBiodata] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    nama: "",
    alamat: "",
    tanggal_lahir: "",
    jenis_kelamin: "Laki-laki",
  });

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/");
      return;
    }
    const userData = JSON.parse(stored);
    setUser(userData);
    fetchBiodata(userData.id);
  }, [router]);

  async function fetchBiodata(userId) {
    try {
      const res = await fetch(`/api/biodata?user_id=${userId}`);
      const data = await res.json();
      if (data.biodata) {
        setBiodata(data.biodata);
        setForm({
          nama: data.biodata.nama || "",
          alamat: data.biodata.alamat || "",
          tanggal_lahir: data.biodata.tanggal_lahir
            ? data.biodata.tanggal_lahir.split("T")[0]
            : "",
          jenis_kelamin: data.biodata.jenis_kelamin || "Laki-laki",
        });
      } else {
        setEditMode(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/biodata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, ...form }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Gagal menyimpan biodata");
        setLoading(false);
        return;
      }

      setBiodata({ ...form });
      setEditMode(false);
      setLoading(false);
    } catch (err) {
      setMessage("Terjadi kesalahan, coba lagi");
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("user");
    router.push("/");
  }

  if (!user) {
    return null;
  }

  const inputStyle = {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    colorScheme: "dark",
  };

  const labelStyle = {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: -6,
    display: "block",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 20% 20%, #1c1130, #0a0710 70%)",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: "100%",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          color: "#d8d3e6",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(6px)",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          padding: 32,
        }}
      >
        <h1 style={{ textAlign: "center", color: "#fff", margin: 0 }}>
          Berhasil
        </h1>
        <p style={{ textAlign: "center", opacity: 0.85 }}>
          Selamat datang, <b>{user.username}</b>!
        </p>

        <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid rgba(255,255,255,0.1)" }} />

        {!editMode && biodata ? (
          <div>
            <h3 style={{ color: "#fff", marginBottom: 12 }}>Biodata</h3>
            <p><b>Nama:</b> {biodata.nama}</p>
            <p><b>Alamat:</b> {biodata.alamat}</p>
            <p><b>Tanggal Lahir:</b> {biodata.tanggal_lahir?.split("T")[0]}</p>
            <p><b>Usia:</b> {hitungUsia(biodata.tanggal_lahir)} tahun</p>
            <p><b>Jenis Kelamin:</b> {biodata.jenis_kelamin}</p>
            <button
              onClick={() => setEditMode(true)}
              style={{
                marginTop: 8,
                padding: "10px 16px",
                border: 0,
                borderRadius: 8,
                background: "linear-gradient(90deg, #7a5cff, #ff7ac6)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Edit Biodata
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h3 style={{ color: "#fff", margin: 0 }}>
              {biodata ? "Edit Biodata" : "Lengkapi Biodata"}
            </h3>

            <div>
              <label style={labelStyle}>Nama</label>
              <input
                type="text"
                required
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Alamat</label>
              <textarea
                required
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                style={{ ...inputStyle, resize: "vertical", minHeight: 60 }}
              />
            </div>

            <div>
              <label style={labelStyle}>Tanggal Lahir</label>
              <input
                type="date"
                required
                value={form.tanggal_lahir}
                onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Jenis Kelamin</label>
              <select
                value={form.jenis_kelamin}
                onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value })}
                style={inputStyle}
              >
                <option value="Laki-laki" style={{ color: "#000" }}>Laki-laki</option>
                <option value="Perempuan" style={{ color: "#000" }}>Perempuan</option>
              </select>
            </div>

            {message && <p style={{ color: "#ff7ac6", fontSize: 13, margin: 0 }}>{message}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                padding: 11,
                border: 0,
                borderRadius: 8,
                background: "linear-gradient(90deg, #7a5cff, #ff7ac6)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {loading ? "Menyimpan..." : "Simpan Biodata"}
            </button>
          </form>
        )}

        <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid rgba(255,255,255,0.1)" }} />

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: 11,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8,
            background: "transparent",
            color: "#d8d3e6",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
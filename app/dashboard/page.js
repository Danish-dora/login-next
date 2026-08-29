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
          alamat: data.biodata.alamat || "",
          tanggal_lahir: data.biodata.tanggal_lahir
            ? data.biodata.tanggal_lahir.split("T")[0]
            : "",
          jenis_kelamin: data.biodata.jenis_kelamin || "Laki-laki",
        });
      } else {
        setEditMode(true); // belum ada biodata, langsung tampilkan form
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

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "60px auto",
        fontFamily: "sans-serif",
        color: "#333",
        background: "#fff",
        padding: 24,
        borderRadius: 12,
      }}
    >
      <h1 style={{ textAlign: "center" }}>Berhasil</h1>
      <p style={{ textAlign: "center" }}>
        Selamat datang, <b>{user.username}</b>!
      </p>

      <hr style={{ margin: "20px 0" }} />

      {!editMode && biodata ? (
        <div>
          <h3>Biodata</h3>
          <p><b>Alamat:</b> {biodata.alamat}</p>
          <p><b>Tanggal Lahir:</b> {biodata.tanggal_lahir?.split("T")[0]}</p>
          <p><b>Usia:</b> {hitungUsia(biodata.tanggal_lahir)} tahun</p>
          <p><b>Jenis Kelamin:</b> {biodata.jenis_kelamin}</p>
          <button onClick={() => setEditMode(true)} style={{ padding: "8px 16px" }}>
            Edit Biodata
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3>{biodata ? "Edit Biodata" : "Lengkapi Biodata"}</h3>

          <div style={{ marginBottom: 12 }}>
            <label>Alamat</label>
            <textarea
              required
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              style={{ width: "100%", padding: 8 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Tanggal Lahir</label>
            <input
              type="date"
              required
              value={form.tanggal_lahir}
              onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
              style={{ width: "100%", padding: 8 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Jenis Kelamin</label>
            <select
              value={form.jenis_kelamin}
              onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value })}
              style={{ width: "100%", padding: 8 }}
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          {message && <p style={{ color: "red" }}>{message}</p>}

          <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
            {loading ? "Menyimpan..." : "Simpan Biodata"}
          </button>
        </form>
      )}

      <hr style={{ margin: "20px 0" }} />

      <button onClick={handleLogout} style={{ padding: "8px 16px" }}>
        Logout
      </button>
    </div>
  );
}
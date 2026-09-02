import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Ambil biodata berdasarkan user_id
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { message: "user_id wajib diisi" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      "SELECT * FROM biodata WHERE user_id = ?",
      [userId]
    );

    return NextResponse.json(
      { biodata: rows.length > 0 ? rows[0] : null },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// Simpan / update biodata
export async function POST(req) {
  try {
    const { user_id, nama, alamat, tanggal_lahir, jenis_kelamin } = await req.json();

    if (!user_id || !nama || !alamat || !tanggal_lahir || !jenis_kelamin) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const [existing] = await pool.query(
      "SELECT user_id FROM biodata WHERE user_id = ?",
      [user_id]
    );

    if (existing.length > 0) {
      await pool.query(
        "UPDATE biodata SET nama = ?, alamat = ?, tanggal_lahir = ?, jenis_kelamin = ? WHERE user_id = ?",
        [nama, alamat, tanggal_lahir, jenis_kelamin, user_id]
      );
    } else {
      await pool.query(
        "INSERT INTO biodata (user_id, nama, alamat, tanggal_lahir, jenis_kelamin) VALUES (?, ?, ?, ?, ?)",
        [user_id, nama, alamat, tanggal_lahir, jenis_kelamin]
      );
    }

    return NextResponse.json(
      { message: "Biodata berhasil disimpan" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
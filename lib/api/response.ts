import { NextResponse } from "next/server";

/** A consistent JSON envelope for all REST routes. */
export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export function ok<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ ok: true, data }, { status });
}

export function fail(
  error: string,
  status = 400,
  fieldErrors?: Record<string, string[]>,
): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ ok: false, error, fieldErrors }, { status });
}

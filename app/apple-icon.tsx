import { ImageResponse } from "next/og";
import { Mark } from "@/lib/mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS rounds the corners itself.
export default function AppleIcon() {
  return new ImageResponse(<Mark size={180} radius={0} />, size);
}

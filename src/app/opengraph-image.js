import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ShrinkVerse - Short Links, Big Reach";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "radial-gradient(circle at 30% 30%, #002b2b 0%, #000 60%)",
                color: "white",
                fontFamily: "system-ui",
            }}
        >
            <div style={{ display: "flex", fontSize: 100, fontWeight: 800 }}>
                <span style={{ color: "#00ffee" }}>Shrink</span>
                <span>Verse</span>
            </div>
            <div
                style={{
                    marginTop: 24,
                    fontSize: 36,
                    color: "#cffefb",
                    opacity: 0.9,
                }}
            >
                Short Links, Big Reach
            </div>
            <div
                style={{
                    marginTop: 60,
                    fontSize: 22,
                    color: "#9ad9d6",
                    letterSpacing: 1,
                }}
            >
                shrinkverse.com
            </div>
        </div>,
        size
    );
}

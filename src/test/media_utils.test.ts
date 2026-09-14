import { describe, it, expect } from "vitest";
import {
    isRealImageUrl,
    isValidVideoUrl,
    isDirectVideoFile,
} from "@/utils/mediaUtils";
import { getYouTubeEmbedUrl } from "@/lib/utils";

describe("mediaUtils", () => {
    describe("isRealImageUrl", () => {
        it("identifies genuine image URLs", () => {
            expect(isRealImageUrl("https://res.cloudinary.com/demo/photo.jpg")).toBe(true);
            expect(isRealImageUrl("/assets/photos/celebrant.png")).toBe(true);
            expect(isRealImageUrl("data:image/png;base64,iVBORw0KGgoAAAANSUhEUg")).toBe(true);
        });

        it("filters out stock, placeholder, and empty image sources", () => {
            expect(isRealImageUrl("https://images.unsplash.com/photo-12345")).toBe(false);
            expect(isRealImageUrl("https://picsum.photos/200/300")).toBe(false);
            expect(isRealImageUrl("https://example.com/demo.jpg")).toBe(false);
            expect(isRealImageUrl("https://via.placeholder.com/150")).toBe(false);
            expect(isRealImageUrl("")).toBe(false);
            expect(isRealImageUrl(null)).toBe(false);
            expect(isRealImageUrl(undefined)).toBe(false);
        });
    });

    describe("isDirectVideoFile", () => {
        it("identifies direct video file paths", () => {
            expect(isDirectVideoFile("https://cdn.example.org/birthday.mp4")).toBe(true);
            expect(isDirectVideoFile("https://cdn.example.org/birthday.webm?token=123")).toBe(true);
        });

        it("rejects non-video extensions", () => {
            expect(isDirectVideoFile("https://cdn.example.org/birthday.mp3")).toBe(false);
            expect(isDirectVideoFile("https://cdn.example.org/photo.jpg")).toBe(false);
        });
    });

    describe("isValidVideoUrl", () => {
        it("validates YouTube formats", () => {
            expect(isValidVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
            expect(isValidVideoUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(true);
            expect(isValidVideoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(true);
            expect(isValidVideoUrl("https://youtube.com/shorts/dQw4w9WgXcQ")).toBe(true);
        });

        it("validates direct mp4 streams", () => {
            expect(isValidVideoUrl("https://storage.googleapis.com/test/video.mp4")).toBe(true);
        });

        it("rejects dummy, local route numbers, and placeholders", () => {
            expect(isValidVideoUrl("0")).toBe(false);
            expect(isValidVideoUrl("/0")).toBe(false);
            expect(isValidVideoUrl("null")).toBe(false);
            expect(isValidVideoUrl("undefined")).toBe(false);
            expect(isValidVideoUrl("https://example.com/video")).toBe(false);
            expect(isValidVideoUrl("")).toBe(false);
            expect(isValidVideoUrl(null)).toBe(false);
        });
    });

    describe("getYouTubeEmbedUrl integration", () => {
        it("transforms watch URL to embed URL", () => {
            expect(getYouTubeEmbedUrl("https://www.youtube.com/watch?v=abc123XYZ")).toBe(
                "https://www.youtube.com/embed/abc123XYZ"
            );
        });

        it("transforms youtu.be short URL to embed URL", () => {
            expect(getYouTubeEmbedUrl("https://youtu.be/abc123XYZ?t=10")).toBe(
                "https://www.youtube.com/embed/abc123XYZ"
            );
        });

        it("preserves non-YouTube direct video URLs", () => {
            expect(getYouTubeEmbedUrl("https://cdn.example.com/party.mp4")).toBe(
                "https://cdn.example.com/party.mp4"
            );
        });
    });
});

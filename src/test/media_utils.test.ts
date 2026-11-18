import { describe, it, expect } from "vitest";
import {
    isRealImageUrl,
    normalizeImageUrl,
    isValidVideoUrl,
    isDirectVideoFile,
} from "@/utils/mediaUtils";
import { getYouTubeEmbedUrl } from "@/lib/utils";

describe("mediaUtils", () => {
    describe("normalizeImageUrl", () => {
        it("strips wrapping single and double quotes", () => {
            expect(normalizeImageUrl('"https://example.org/photo.jpg"')).toBe("https://example.org/photo.jpg");
            expect(normalizeImageUrl("'https://example.org/photo.jpg'")).toBe("https://example.org/photo.jpg");
        });

        it("converts Google Drive sharing links to direct embeddable streams", () => {
            expect(normalizeImageUrl("https://drive.google.com/file/d/1A2B3C4D5E6F/view?usp=sharing"))
                .toBe("https://lh3.googleusercontent.com/d/1A2B3C4D5E6F");
            expect(normalizeImageUrl("https://drive.google.com/open?id=1A2B3C4D5E6F"))
                .toBe("https://lh3.googleusercontent.com/d/1A2B3C4D5E6F");
            expect(normalizeImageUrl("https://drive.google.com/uc?id=1A2B3C4D5E6F"))
                .toBe("https://lh3.googleusercontent.com/d/1A2B3C4D5E6F");
        });

        it("converts Dropbox links to direct binary streams", () => {
            expect(normalizeImageUrl("https://www.dropbox.com/s/sample123/birthday.jpg?dl=0"))
                .toBe("https://www.dropbox.com/s/sample123/birthday.jpg?raw=1");
            expect(normalizeImageUrl("https://www.dropbox.com/s/sample123/birthday.jpg"))
                .toBe("https://www.dropbox.com/s/sample123/birthday.jpg?raw=1");
        });

        it("converts Imgur page URLs to direct image URLs", () => {
            expect(normalizeImageUrl("https://imgur.com/AbCdEfG"))
                .toBe("https://i.imgur.com/AbCdEfG.jpg");
        });

        it("safely handles null, undefined, and empty strings", () => {
            expect(normalizeImageUrl("")).toBe("");
            expect(normalizeImageUrl(null)).toBe("");
            expect(normalizeImageUrl(undefined)).toBe("");
        });
    });

    describe("isRealImageUrl", () => {
        it("identifies genuine image URLs including Unsplash, Cloudinary, and Google Drive", () => {
            expect(isRealImageUrl("https://res.cloudinary.com/demo/photo.jpg")).toBe(true);
            expect(isRealImageUrl("/assets/photos/celebrant.png")).toBe(true);
            expect(isRealImageUrl("data:image/png;base64,iVBORw0KGgoAAAANSUhEUg")).toBe(true);
            expect(isRealImageUrl("https://images.unsplash.com/photo-1513151233558-d860c5398176")).toBe(true);
            expect(isRealImageUrl("https://picsum.photos/200/300")).toBe(true);
            expect(isRealImageUrl("https://drive.google.com/file/d/1A2B3C4D5E6F/view?usp=sharing")).toBe(true);
        });

        it("filters out fake placeholder domains and empty image sources", () => {
            expect(isRealImageUrl("https://example.com/demo.jpg")).toBe(false);
            expect(isRealImageUrl("https://via.placeholder.com/150")).toBe(false);
            expect(isRealImageUrl("")).toBe(false);
            expect(isRealImageUrl(null)).toBe(false);
            expect(isRealImageUrl(undefined)).toBe(false);
            expect(isRealImageUrl("null")).toBe(false);
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

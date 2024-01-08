const ALLOWED_INLINE_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/apng',
  'image/webp',
  'image/bmp',
  'image/tiff',
  'image/gif',
];

const ALLOWED_INLINE_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
];

/**
 * Returns whether the given file should be rendered as an inline image.  If
 * false, the file should be rendered as a download link.
 */
export function isInlineDisplayableImage(file: { mimeType: string }) {
  return ALLOWED_INLINE_IMAGE_MIME_TYPES.includes(file.mimeType);
}

export function isInlineDisplayableVideo(file: { mimeType: string }) {
  return ALLOWED_INLINE_VIDEO_MIME_TYPES.includes(file.mimeType);
}

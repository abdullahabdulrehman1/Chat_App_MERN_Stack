import multer from "multer";

export const multerUploads = multer({
  limits: { fileSize: 1024 * 1024 * 5 },
});
export const singleAvatar = multerUploads.single("avatar");
export const attachmentsMulter = multerUploads.array("files", 5); 
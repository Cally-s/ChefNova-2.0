const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function functionBody(name) {
  const marker = `function ${name}(`;
  const start = app.indexOf(marker);
  assert(start >= 0, `${name} should exist.`);
  let parenDepth = 0;
  let paramsClosedAt = -1;
  for (let index = app.indexOf("(", start); index < app.length; index += 1) {
    if (app[index] === "(") parenDepth += 1;
    if (app[index] === ")") parenDepth -= 1;
    if (parenDepth === 0) {
      paramsClosedAt = index;
      break;
    }
  }
  const braceStart = app.indexOf("{", paramsClosedAt);
  let depth = 0;
  for (let index = braceStart; index < app.length; index += 1) {
    if (app[index] === "{") depth += 1;
    if (app[index] === "}") depth -= 1;
    if (depth === 0) return app.slice(start, index + 1);
  }
  throw new Error(`${name} body was not closed.`);
}

[
  "normalizeUserAvatar",
  "renderUserAvatar",
  "renderProfilePictureSection",
  "validateAvatarFile",
  "detectAvatarImageType",
  "handleProfileAvatarFile",
  "drawAvatarVariant",
  "adjustProfileAvatarCrop",
  "saveProfileAvatar",
  "openRemoveProfileAvatarDialog",
  "removeProfileAvatar",
  "closeProfileAvatarModal",
  "handleProfileAvatarKeydown"
].forEach((name) => functionBody(name));

assert(app.includes('const AVATAR_STORAGE_PREFIX = "chefNovaAvatarObject"'), "Avatar images should use a separate local object key prefix.");
assert(app.includes("AVATAR_MAX_FILE_SIZE = 10 * 1024 * 1024"), "Avatar uploads should be limited to 10 MB.");
assert(app.includes('"image/jpeg"') && app.includes('"image/png"') && app.includes('"image/webp"'), "Avatar uploads should allow JPEG, PNG, and WebP only.");
assert(html.includes("id=\"profileAvatarModal\""), "Profile avatar workflow should use a dedicated accessible modal.");
assert(html.includes("aria-labelledby=\"profileAvatarModalTitle\""), "Avatar modal should be labelled.");

const normalizer = functionBody("normalizeUserAccount");
assert(normalizer.includes("normalizeUserAvatar(user.avatar)"), "User normalization should preserve avatar metadata.");
assert(!normalizer.includes("avatarBase64"), "The user account record should not store avatarBase64.");

const avatarNormalizer = functionBody("normalizeUserAvatar");
assert(avatarNormalizer.includes("objectKey") && avatarNormalizer.includes("version") && avatarNormalizer.includes("variants"), "Avatar metadata should include object key, version, and variants.");

const renderer = functionBody("renderUserAvatar");
assert(renderer.includes("getAvatarSource"), "Avatar renderer should load image variants from the separate avatar object store.");
assert(renderer.includes("getAvatarInitials"), "Avatar renderer should fall back to display-name initials.");
assert(!renderer.includes("email"), "Fallback avatar should not expose the user's email address.");

const profileSection = functionBody("renderProfilePictureSection");
assert(profileSection.includes("Upload Profile Picture") && profileSection.includes("Change Picture") && profileSection.includes("Remove Picture"), "Profile page should expose upload/change/remove actions for registered users.");
assert(profileSection.includes("Supported formats: JPG, PNG, WebP") && profileSection.includes("10 MB"), "Profile page should show format and size guidance.");

const guestPanel = functionBody("renderGuestAccountPanel");
assert(guestPanel.includes("Create an account to add a permanent profile picture."), "Guest users should not receive permanent avatar upload controls.");
assert(!guestPanel.includes("data-profile-avatar-upload"), "Guest panel should not include permanent avatar upload action.");

const validation = functionBody("validateAvatarFile");
assert(validation.includes("AVATAR_ALLOWED_TYPES.includes(file.type)"), "Validation should check MIME type.");
assert(validation.includes("file.size > AVATAR_MAX_FILE_SIZE"), "Validation should reject oversized images.");
assert(validation.includes("detectAvatarImageType"), "Validation should verify image magic bytes.");
assert(validation.includes("detectedType !== file.type"), "Validation should reject renamed/disguised files.");

const detector = functionBody("detectAvatarImageType");
assert(detector.includes("0xff") && detector.includes("0x89") && detector.includes("0x52") && detector.includes("0x57"), "Magic-byte checks should cover JPEG, PNG, and WebP.");

const fileHandler = functionBody("handleProfileAvatarFile");
assert(fileHandler.includes("loadAvatarImage"), "Selected files should be decoded before preview.");
assert(fileHandler.includes("uploadUserId !== getCurrentUser()?.id"), "Late callbacks after account switching should be rejected.");
assert(fileHandler.includes("renderProfileAvatarPreviewPanel"), "Valid files should show preview before saving.");

const saver = functionBody("saveProfileAvatar");
assert(saver.includes("session.userId !== user.id"), "Saving should be bound to the account that started the upload.");
assert(saver.includes("drawAvatarVariant(session, 96)") && saver.includes("drawAvatarVariant(session, 192)") && saver.includes("drawAvatarVariant(session, 512)"), "Saving should generate small, medium, and large avatar variants.");
assert(saver.includes("updateCurrentUserAvatar(nextAvatar)"), "Avatar metadata should be saved only after image variants are stored.");
assert(saver.includes("previousAvatar") && saver.includes("localStorage.removeItem(key)"), "Replacement should remove old image objects only after successful metadata update.");
assert(saver.includes("writtenKeys.forEach"), "Failed uploads should clean temporary variant records.");

const remover = functionBody("openRemoveProfileAvatarDialog");
assert(remover.includes("Keep Picture") && remover.includes("Remove Picture"), "Removal confirmation should use explicit button labels.");
assert(!remover.includes("confirm("), "Removal should not use a vague browser confirm dialog.");

const keydown = functionBody("handleProfileAvatarKeydown");
assert(keydown.includes("ArrowLeft") && keydown.includes("ArrowRight") && keydown.includes("ArrowUp") && keydown.includes("ArrowDown"), "Crop positioning should have keyboard alternatives.");
assert(keydown.includes("zoom-in") && keydown.includes("zoom-out"), "Crop zoom should have keyboard alternatives.");

assert(css.includes(".profile-picture-section"), "Profile picture section should be styled.");
assert(css.includes(".profile-avatar-modal-backdrop"), "Avatar modal backdrop should be styled.");
assert(css.includes(".profile-avatar-preview-canvas"), "Avatar preview canvas should be styled.");
assert(css.includes("@media (max-width: 640px)") && css.includes(".profile-picture-card"), "Avatar UI should have mobile-responsive styling.");

console.log("Profile avatar static checks passed.");

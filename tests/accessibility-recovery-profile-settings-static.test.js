const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function extractFunction(name) {
  const start = app.indexOf(`function ${name}`);
  assert(start >= 0, `${name} exists`);
  const next = app.indexOf("\n  function ", start + 1);
  return app.slice(start, next === -1 ? app.length : next);
}

(function run() {
  const profileMenu = extractFunction("renderAccount");
  const accessibilitySettings = extractFunction("renderAccessibilityRecoverySettingsSection");
  const recoveryPage = extractFunction("renderAccessibilityRecoveryPage");
  const keyboardShortcut = extractFunction("handleRecoveryKeyboardShortcut");
  const openRecovery = extractFunction("openAccessibilityRecovery");
  const returnRecovery = extractFunction("returnFromAccessibilityRecovery");
  const restoreDefaults = extractFunction("restoreDisplayDefaultsFromUI");

  assert(!html.includes("accessibility-recovery-button"), "topbar Accessibility Recovery button is removed");
  assert(!html.includes("data-nav-item=\"accessibilityRecovery\""), "sidebar Accessibility Recovery nav link is removed");
  assert(!css.includes(".accessibility-recovery-button"), "obsolete recovery button CSS is removed");
  assert(!css.includes(".topbar-recovery-actions"), "obsolete topbar recovery container CSS is removed");

  assert(profileMenu.includes("Accessibility Settings"), "Profile menu contains Accessibility Settings");
  assert(profileMenu.includes("data-page=\"account/accessibility\""), "Profile menu item opens Accessibility settings");
  assert(accessibilitySettings.includes("ACCESSIBILITY"), "Profile Settings includes ACCESSIBILITY section label");
  assert(accessibilitySettings.includes("id=\"profileAccessibilitySettings\""), "Accessibility settings have a stable section anchor");
  assert(accessibilitySettings.includes("id=\"accessibilitySettingsTitle\""), "Accessibility settings heading is focusable");
  assert(accessibilitySettings.includes("Font size"), "font size control remains available");
  assert(accessibilitySettings.includes("Line spacing"), "text spacing control remains available");
  assert(accessibilitySettings.includes("High contrast"), "high contrast control remains available");
  assert(accessibilitySettings.includes("Reduced motion"), "reduced motion control remains available");
  assert(accessibilitySettings.includes("Large buttons"), "large buttons control remains available");
  assert(accessibilitySettings.includes("One-instruction mode"), "one-instruction mode control is available");
  assert(accessibilitySettings.includes("Keyboard help"), "keyboard help is available in Accessibility settings");
  assert(accessibilitySettings.includes("data-restore-display-defaults"), "Restore Display Defaults remains in Accessibility settings");
  assert(accessibilitySettings.includes("data-open-accessibility-recovery"), "Accessibility Recovery opens from Profile settings");
  assert(accessibilitySettings.includes("Report an Accessibility or Language Problem"), "feedback entry remains available");

  assert(recoveryPage.includes("ACCESSIBILITY RECOVERY"), "Recovery page uses requested heading label");
  [
    "Restore Display Defaults",
    "Return to Previous Display Settings",
    "Turn On Large Buttons",
    "Turn On High Contrast",
    "Turn Off Animations",
    "Change Language",
    "Continue with Text Only",
    "Open Keyboard Help",
    "Report an Accessibility or Language Problem",
    "Return to Previous Screen"
  ].forEach((label) => assert(recoveryPage.includes(label), `Recovery page action remains available: ${label}`));

  assert(openRecovery.includes("captureAccessibilitySessionSnapshot()"), "opening recovery captures current recipe, step, timers, and drafts");
  assert(openRecovery.includes("accessibilityRecoveryReturnTarget"), "opening recovery stores a return target");
  assert(returnRecovery.includes("navigate(target.page"), "returning recovery goes back to the saved page");
  assert(returnRecovery.includes("focusElementId"), "returning recovery restores focus when possible");
  assert(keyboardShortcut.includes("typing") && keyboardShortcut.includes("return false"), "keyboard shortcut does not activate while typing");
  assert(restoreDefaults.includes("It will not change your recipes, pantry, allergies, dietary restrictions, languages, meal plans, shopping lists, timers, or budget information."), "restore defaults warning preserves non-display data");
  assert(css.includes("#accessibilitySettingsTitle:focus-visible"), "Accessibility settings focus indicator is visible");
  assert(css.includes("@media (max-width: 640px)") && css.includes(".accessibility-recovery-actions"), "Recovery actions stack on mobile");

  console.log("Accessibility Recovery Profile Settings static tests passed.");
})();

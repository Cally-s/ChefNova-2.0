const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");

function cssBlock(selector) {
  const start = css.indexOf(selector);
  assert(start >= 0, `${selector} should exist.`);
  const braceStart = css.indexOf("{", start);
  let depth = 0;
  for (let index = braceStart; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") depth -= 1;
    if (depth === 0) return css.slice(braceStart + 1, index);
  }
  throw new Error(`${selector} block was not closed.`);
}

const passwordToggleCount = (html.match(/data-toggle-password/g) || []).length + (app.match(/data-toggle-password/g) || []).length;
assert(passwordToggleCount >= 7, "All login, sign-up, and password-change password fields should keep toggle buttons.");
assert(!html.includes(">Show</button>"), "Password toggles in HTML should not use visible Show text.");
assert(!app.includes(">Show</button>"), "Generated password toggles should not use visible Show text.");
assert(html.includes("password-toggle-icon") && app.includes("password-toggle-icon"), "Password toggles should render an icon element.");
assert(html.includes('aria-label="Show password"'), "Password toggles should keep accessible Show password labels.");
assert(html.includes('aria-label="Show confirm password"'), "Confirm password toggles should keep accessible labels.");
assert(html.includes('aria-describedby="welcomeRegisterPasswordHelp"') && html.includes('aria-describedby="registerPasswordHelp"'), "Sign-up password helper text should be associated with the password inputs.");
assert(app.includes('button.setAttribute("aria-label"'), "Toggle logic should update the accessible label.");
assert(app.includes('button.classList.toggle("is-visible"'), "Toggle logic should update the crossed-eye state.");

const passwordField = cssBlock(".password-field");
assert(passwordField.includes("display: flex"), "Password field should use a real flexible control layout.");
assert(passwordField.includes("min-width: 0"), "Password field should be allowed to shrink without clipping.");
assert(!passwordField.includes("position: relative"), "Password field should not rely on an overlaid text button.");

const passwordInput = cssBlock(".password-field input");
assert(passwordInput.includes("flex: 1 1 auto"), "Password input should take the remaining available width.");
assert(passwordInput.includes("min-width: 0"), "Password input should not force horizontal overflow.");
assert(!passwordInput.includes("padding-right: 78px"), "Password input should not reserve space for the old text Show button.");

const passwordToggle = cssBlock(".password-toggle");
assert(passwordToggle.includes("width: 44px") && passwordToggle.includes("height: 44px"), "Password toggle should be compact but touch-friendly.");
assert(passwordToggle.includes("flex: 0 0 auto"), "Password toggle should not stretch and squeeze the input.");
assert(!passwordToggle.includes("position: absolute"), "Password toggle should not overlay the input text.");

const formGrid = cssBlock(".form-grid.two");
assert(formGrid.includes("repeat(auto-fit") && formGrid.includes("minmax(min(100%, 18rem), 1fr)"), "Two-column form rows should stack automatically when narrow.");
assert(css.includes("@container (max-width: 42rem)"), "Auth forms should include container-based responsive behavior.");
assert(css.includes(".welcome-auth-panel") && css.includes("overflow-x: hidden"), "Welcome auth panels should avoid horizontal form scrolling.");
assert(css.includes(".account-form label") && css.includes("overflow-wrap: break-word"), "Labels and helper text should wrap instead of clipping.");
assert(css.includes("@media (forced-colors: active)") && css.includes(".password-toggle-icon"), "Password icon toggle should support forced-colors mode.");

console.log("Sign-up form layout static checks passed.");

# Step 18 — Authentication Validation Implementation Report

## Goal

Add complete and consistent validation for Chef Nova Sign Up and Log In forms while preventing invalid accounts, duplicate emails, incomplete forms, and revealing login errors.

## Files Changed

- `index.html`
- `app.js`
- `style.css`
- `co-gpt/step-18-authentication-validation-report.md`

## Sign-Up Validation

Added reusable `validateSignupForm(form)` validation.

Sign Up now checks:

- Name is not blank.
- Email is completed.
- Email format is valid.
- Email is not already registered.
- Password is completed.
- Password is at least 8 characters.
- Confirm Password is completed.
- Confirm Password matches exactly.
- Age is a whole number from 1 to 120.
- Required selections and required account fields are completed.

No account is created unless validation passes.

## Login Validation

Added reusable `validateLoginForm(form)` validation.

Log In now checks:

- Email is completed.
- Email format is valid.
- Password is completed.
- Credentials match a saved account.

Invalid completed credentials always show:

```text
Incorrect email or password.
```

Do not reveal whether only the email or password was wrong during login. Use one combined error message.

## Email Normalization

Emails are normalized with:

- Trimmed spaces
- Lowercase comparison and storage

Example:

```text
Cally@Example.com 
```

becomes:

```text
cally@example.com
```

## Duplicate-Email Protection

Added `findUserByEmail(email)`.

Duplicate checks compare normalized email addresses, so `CALLY@example.com` and `cally@example.com` are treated as the same account.

Required message included:

```text
This email is already registered.
```

## Password Minimum

Added one reusable constant:

```js
const MIN_PASSWORD_LENGTH = 8;
```

Sign Up uses this constant for password length validation.

Required message included:

```text
Password must be at least 8 characters.
```

## Confirm Password Matching

Confirm Password is checked for:

- Blank value
- Exact password match

Required message included:

```text
Passwords do not match.
```

## Age Validation

Added `isValidAge(value)`.

Accepted age values:

- Whole number
- 1 through 120

Invalid values show:

```text
Please enter a valid age.
```

## Required Selections

Required account fields and selections are checked.

Incomplete required account choices show:

```text
Please complete all required selections.
```

## Combined Login Error

Login no longer displays:

- Email not found
- Account does not exist
- Incorrect password
- Wrong password

Instead, unknown email and wrong password both use:

```text
Incorrect email or password.
```

## Error Display Helpers

Added reusable helpers:

- `displayAuthFieldError(field, message)`
- `clearAuthFieldError(field)`
- `clearAllAuthErrors(form)`
- `displayAuthSummaryError(form, message)`
- `focusFirstInvalidField(form, errors)`

Errors are displayed beside fields and in the form message area.

## Focus Management

After failed validation:

- The first invalid field receives focus.
- User-entered form values remain in place.
- Old errors clear before each validation attempt.

For credential-level login failure, focus returns to the email field.

## Accessibility

Validation now uses:

- `aria-invalid="true"`
- `aria-describedby`
- `role="alert"` for generated error text
- Visible form-level error messages
- Enter-key form submission through submit handlers

All auth forms now use `novalidate` so custom Chef Nova messages are consistent.

## Responsive Design

Added `.form-error` and `.form-error-summary` styles so validation messages wrap cleanly on small screens and use text plus borders/outlines instead of relying only on color.

## User Guide Update

Updated the existing Account guide section with:

- Sign-Up validation rules
- Login validation rules
- Explanation that invalid login always displays `Incorrect email or password.`
- Explanation that Chef Nova does not reveal whether the email or password was incorrect

## Exact Required Messages Included

```text
Please enter your email.
This email is already registered.
Passwords do not match.
Incorrect email or password.
```

## Required Note

Sign-Up validation protects account quality, while Login validation uses a combined credential error to avoid revealing whether a saved email exists.

## Tests Run

Passed:

```bash
node --check app.js
node --check rules.js
node --check data/recipes.js
node -e "JSON.parse(require('fs').readFileSync('data/recipes.json','utf8'))"
```

Additional static checks confirmed:

- `MIN_PASSWORD_LENGTH` is present.
- `validateSignupForm()` exists.
- `validateLoginForm()` exists.
- `findUserByEmail()` exists.
- Required exact messages are present.
- Old revealing login messages are no longer present in active validation.
- Auth forms use `novalidate`.

## Risks or Remaining Notes

- Browser automation was not used because local `file://` automation was previously blocked by the in-app browser security policy.
- Passwords remain stored locally in plain text because Chef Nova is a front-end demonstration project; the code keeps the existing demo-only warning.
- No Git commit was created.

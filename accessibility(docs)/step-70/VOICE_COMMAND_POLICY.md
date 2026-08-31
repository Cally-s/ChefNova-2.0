# Voice Command Policy

Voice commands are grouped by risk:

- Read-only: may run from the initial voice request.
- Navigation: may move the user to visible app areas.
- Reversible: may start or adjust reversible controls.
- Sensitive: may only open visible review.
- Destructive: may only open visible review and needs stronger confirmation.

Protected actions include deleting allergies, removing dietary restrictions, confirming discarded food, freezing food, marking a meal completed, cancelling a meal, and deleting Pantry data. Generic voice replies like "yes" are rejected for protected actions.

# Offline Rollback

Offline packages keep immutable approved recipe snapshots. A fully offline device cannot receive a newly issued rollback until it reconnects.

On reconnection, Chef Nova marks affected packages as update required, preserves cooking progress, and offers the approved corrected package. Draft translations must never replace downloaded approved content.

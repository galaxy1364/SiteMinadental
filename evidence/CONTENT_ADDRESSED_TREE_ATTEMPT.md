# Content-addressed tree attempt

The exact Git blob SHA-1 of every supplied Build file is known. A new tree may reference only those immutable blob IDs. If GitHub does not recognize any blob in this repository, the operation must fail before a commit or branch update. No fallback substitution is allowed.

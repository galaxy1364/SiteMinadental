# Security Policy

## Supported production surface

Security reports should target the current production website and patient/admin surfaces for `minadentalclinic.ir`.

## Reporting a vulnerability

Please use the clinic contact channel at https://minadentalclinic.ir/#contact and clearly mark the message as a security report. Do not include patient data, credentials, authentication tokens, private medical records, or other sensitive information in the initial report.

Please include, where safe to do so:

- affected URL or component;
- a concise description of the issue and impact;
- reproducible steps using non-sensitive test data;
- browser/device details when relevant;
- suggested remediation if available.

## Safe testing expectations

Do not access or alter another person's data, degrade availability, send bulk traffic, bypass rate limits at scale, perform social engineering, or persist access. Stop testing when sensitive data could be exposed and report the issue through the contact channel.

## Security principles

The production system is intended to follow least privilege, server-side secret isolation, deny-by-default authorization, privacy-by-design, auditable administrative actions, secure headers/CSP, rate limiting on abuse-sensitive operations, and evidence-based release gates.

A public security policy is not a certification and does not replace an independent penetration test or jurisdiction-specific legal review.

# Ubirch Verification Pages

This Project contains the Ubirch Verification Pages to check if a special certificate is really anchored in the blockchain

Pages are generated with [hugo](https://gohugo.io)

## Setup Helm Charts

For the different stages please

1. Replace the following Placeholders in <code>config.prod.toml</code>:

  * @@VERIFICATION_HUGO_BASE_URL@@
    Base URL where this pages will run, examples:
    - https://verify.govdigital.de/
    - https://verification.ubirch.com/
    - https://verification.dev.ubirch.com/

  * @@VERIFICATION_SCRIPT_URL@@
    URL of the verification.js script, loaded to verify certificates;
    it's important to import the script from the same stage where the certificates which should be verified are anchored, examples:
    - https://console.prod.ubirch.com/libs/verification/verification.js
    - https://console.dev.ubirch.com/libs/verification/verification.js
    - https://console.demo.ubirch.com/libs/verification/verification.js

  * @@SHOW_DEMO_DISCLAIMER@@
    On some pages (e.g. /v/gd-vcc) a demo disclaimer can be displayed across the form.
    To activate it set this Parameter to "demo" otherwise to "none"

2. Replace <code>config.toml</code> with <code>config.prod.toml</code>

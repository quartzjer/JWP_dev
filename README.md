# JWP ref implementation WIP

The code in this repo is the early steps for a reference JWP implementation in node.  It's current state is for supporting the standards work with valid examples.

The examples below may be out of date, don't use as an authoritative reference.


# Single-Use

This is a very simple use of traditional ECDSA signatures that supports selective disclosure, unlinkability is only achieved by requiring that each one is single-use.  When the holder has an active relationship with the issuer where they can fetch new single-use credentials dynamically or pre-fetch them in batches, this approach is very efficient and immediately usable with existing traditional crypto libraries.

The issuer generates an ephemeral keypair and uses that to sign each payload, simply appending each of those to compose the initial signature.  The ephemeral public key is included in the headers and integrity protected. They then sign that appended list of signatures with their own stable keypair to create the final issued credential.

The holder can then choose which payloads to reveal and only those sections of the signature will need to be validated along with the final signature using the issuer's public key.

Here's some pseudocode:
```
EK = ephemeral key
IK = issuer key 
sigs = join(EK.sign(JWK(EK)), EK.sign(payload[0]), EK.sign(payload[1]), EK.sign(payload[2]), ...)
su_sig = join(sigs, IK.sign(sigs))
```

JWK
```json
{
  "kty": "EC",
  "x": "3Gw_RV47CvLyqnXvuCHybn5aj2ACo_0YZEo9HhDTtQo",
  "y": "l7M9IGTmWB9IjhzHAimUY0GSgxgaiu5BIHnqQ6McHhA",
  "crv": "P-256",
  "kid": "tEB7zx2XKlq8A-9h5arvXlhcDREbWhD7lG2WxKtN39c",
  "alg": "SU-ES256",
  "use": "proof"
}
```

Protected Header
```json
{
  "kid": "tEB7zx2XKlq8A-9h5arvXlhcDREbWhD7lG2WxKtN39c",
  "iss": "https://issuer.tld",
  "claims": [
    "family_name",
    "given_name",
    "email",
    "age"
  ]
}
```

JWP JSON
```json
{
  "payloads": [
    "Ik1pbGxlciI",
    "IkplcmVtaWUi",
    "ImplckBqZXJlbWllLmNvbSI",
    "NDI"
  ],
  "protected": "eyJraWQiOiJ0RUI3engyWEtscThBLTloNWFydlhsaGNEUkViV2hEN2xHMld4S3ROMzljIiwiaXNzIjoiaHR0cHM6Ly9pc3N1ZXIudGxkIiwiY2xhaW1zIjpbImZhbWlseV9uYW1lIiwiZ2l2ZW5fbmFtZSIsImVtYWlsIiwiYWdlIl19",
  "proof": "Vq6xf3UOtN7fDcmwMQw9aoOq6lCrbpla0aeZIo4mEmGgHZw9QxBb4y5cFUgMhKkoHTsvyzmZXwQ3C3ZXA5liIG-JHY943Bsu4B-zvjG58srhhnM8EH7MhXaeRdn01VB6x4xllJu3JvGKFEczVOEPUmGySkA8sL-opp9ilMTS7ZKfJQdhuzQyYs-34aIs_LtlCD0D0hvHomT8CqGLXRjqQPSkpm58fX0KtERTD6ga9mMqZRI9-7LcZC11jV8HGauHLn4ip8PXYtkc03RkQJESzQwsBoRsrzUUAwesDjqrWNHzxeQPu1sDTafvtNT3Eks5924wsFG59lq1eFugpor7zwNysCRhtHdyrFfWa7CksbtIz57yDHgk9S5e0K5hdDr3wEhfzN6CzuHi6xHmIVw6d5P-EGYjQ3IpEvGGwxlwAIivTmDefZRDdcsYud3FY6Dyvs2zHREAJ3XjB74QOnV-fGpmjYii5sn493WtmssFKIq1GLBFU2typPO8x-bMztAL"
}
```

JWP Compact
```
ImV5SnJhV1FpT2lKMFJVSTNlbmd5V0V0c2NUaEJMVGxvTldGeWRsaHNhR05FVWtWaVYyaEVOMnhITWxkNFMzUk9NemxqSWl3aWFYTnpJam9pYUhSMGNITTZMeTlwYzNOMVpYSXVkR3hrSWl3aVkyeGhhVzF6SWpwYkltWmhiV2xzZVY5dVlXMWxJaXdpWjJsMlpXNWZibUZ0WlNJc0ltVnRZV2xzSWl3aVlXZGxJbDE5Ig.Ik1pbGxlciI~IkplcmVtaWUi~ImplckBqZXJlbWllLmNvbSI~NDI.Vq6xf3UOtN7fDcmwMQw9aoOq6lCrbpla0aeZIo4mEmGgHZw9QxBb4y5cFUgMhKkoHTsvyzmZXwQ3C3ZXA5liIG-JHY943Bsu4B-zvjG58srhhnM8EH7MhXaeRdn01VB6x4xllJu3JvGKFEczVOEPUmGySkA8sL-opp9ilMTS7ZKfJQdhuzQyYs-34aIs_LtlCD0D0hvHomT8CqGLXRjqQPSkpm58fX0KtERTD6ga9mMqZRI9-7LcZC11jV8HGauHLn4ip8PXYtkc03RkQJESzQwsBoRsrzUUAwesDjqrWNHzxeQPu1sDTafvtNT3Eks5924wsFG59lq1eFugpor7zwNysCRhtHdyrFfWa7CksbtIz57yDHgk9S5e0K5hdDr3wEhfzN6CzuHi6xHmIVw6d5P-EGYjQ3IpEvGGwxlwAIivTmDefZRDdcsYud3FY6Dyvs2zHREAJ3XjB74QOnV-fGpmjYii5sn493WtmssFKIq1GLBFU2typPO8x-bMztAL
```

# BBS

JWK
```json
{
  "kty": "OKP",
  "crv": "Bls12381G2",
  "x": "liFtc7SMu94i1AC5dsuNuBOAu8eb7C2ZXJHSrLoornwhpc9Ewveh7uMVaQp7_qcRCc_VsyiKTrOKdDTJwgluFC6RDzHrwpMgeRarI-ucK0GL9_5UCdSj2aQErGkWbJ0E",
  "kid": "P80NWuuGdo8wF0BS3QgvEwcUezIWmgdf_qAu9wGOMT4",
  "alg": "BBS+",
  "use": "proof"
}
```

Protected Header
```json
{
  "kid": "P80NWuuGdo8wF0BS3QgvEwcUezIWmgdf_qAu9wGOMT4",
  "issuer": "https://issuer.tld",
  "claims": [
    "family_name",
    "given_name",
    "email",
    "age"
  ]
}
```

JWP JSON
```json
{
  "protected": "eyJraWQiOiJQODBOV3V1R2RvOHdGMEJTM1FndkV3Y1VleklXbWdkZl9xQXU5d0dPTVQ0IiwiaXNzdWVyIjoiaHR0cHM6Ly9pc3N1ZXIudGxkIiwiY2xhaW1zIjpbImZhbWlseV9uYW1lIiwiZ2l2ZW5fbmFtZSIsImVtYWlsIiwiYWdlIl19",
  "payloads": [
    "Ik1pbGxlciI",
    "IkplcmVtaWUi",
    "ImplckBqZXJlbWllLmNvbSI",
    "NDI"
  ],
  "proof": "uU1G3McaQjdeNIvjV0Yhs9au0roJtcRnQi_ShdiKf_unWbS_4NCfApOUKoq5VGRyYUHlKfzccE4m7waZyoLEkBLFiK2g54Q2i-CdtYBgDdkUDsoULSBMcH1MwGHwdjfXpldFNFrHFx_IAvLVniyeMQ"
}
```

JWP Compact
```
ImV5SnJhV1FpT2lKUU9EQk9WM1YxUjJSdk9IZEdNRUpUTTFGbmRrVjNZMVZsZWtsWGJXZGtabDl4UVhVNWQwZFBUVlEwSWl3aWFYTnpkV1Z5SWpvaWFIUjBjSE02THk5cGMzTjFaWEl1ZEd4a0lpd2lZMnhoYVcxeklqcGJJbVpoYldsc2VWOXVZVzFsSWl3aVoybDJaVzVmYm1GdFpTSXNJbVZ0WVdsc0lpd2lZV2RsSWwxOSI.Ik1pbGxlciI~IkplcmVtaWUi~ImplckBqZXJlbWllLmNvbSI~NDI.uU1G3McaQjdeNIvjV0Yhs9au0roJtcRnQi_ShdiKf_unWbS_4NCfApOUKoq5VGRyYUHlKfzccE4m7waZyoLEkBLFiK2g54Q2i-CdtYBgDdkUDsoULSBMcH1MwGHwdjfXpldFNFrHFx_IAvLVniyeMQ
```

# Generic Algorigthm Interface

Exploring the API between a JWP implementation and the one or more proof algorithms internal to it.  This isn't intended for end applications, it's only the abstraction to the lower crypto engines, and as such it doesn't involve any overall container aspects.

There is a lot of optionality in order to support different algorithm capabilities. The logic using this API must have it's own mechanism for consistently ordering the payloads across each entity.  It must also have external protocol mechanisms for exchanging any of the options between the entities.

### Signing Request (OPTIONAL)

Only for algorithms that support these options.  Requests need to be sent to the Issuer to be used when signing.

Pseudocode:
```
// optional, if algo supports binding
HK = holder key
signer_request = algo.signer_request(HK, options)

// optional, used to support blinded payloads
payload_request = algo.payload_request(payload, options)
```

### Issuer Signing

* JWP only requires serialization of the protected header
  * payloads are serialized by the algorithm as-needed
  * options are per-payload and may be algo specific
  * for example, blinded payloads will just be an EC point
  * algo MUST provide integrity protection
* If the algo internally supports binding, that will be via a sign_request
* The algo internally structures which slot is used for the protected header
* addPayload() must always be called in the same order across all usages

Pseudocode:
```
IK = issuer key
signer = algo.signer(IK, options) // options may include signer_request if provided
signer.setProtected(base64(protected header))
signer.addPayload(payload1, options) // options may include payload_request if provided
signer.addPayload(payload2, options)
signer.addPayload(payload3, options)
sig = signer.sign()
```

### Holder Validating

Used to validate the signature was created correctly.

```
validator = algo.validate(IK, sig, options) // options may include signer_request if used
validator.setProtected(base64(protected header))
validator.addPayload(payload1, options) // options may include payload_request if used 
validator.addPayload(payload2, options)
validator.addPayload(payload3, options)
ok = validator.validate()
```

### Proof Request (OPTIONAL)

Only for algorithms that support these options.  Requests need to be sent to the Holder to be used when deriving.

Pseudocode:
```
// optional, if algo supports binding the proof to the verifier
VK = verifier key
prover_request = algo.prover_request(VK, options)

// per-payload and optional, used to request predicate proofs, etc, holder applies to the correct payload
proof_request = algo.proof_request(options)
```

### Holder Proving

* Similar to signing
* prover options MAY include a prover_request from the requesting verifier
  * For example, some algos require specific verifier nonce values to be used to bind the proof to the Verifier
* For algos with internal binding support, prover options would also contain keys/flags/etc
* prover addPayload() behavior:
  * payload and no options == fully revealed/disclosed payload
  * payload with options
    * option for this payload to be hidden / non-disclosed
    * other options may be algorithm specific, may be a PoK, predicate proof request, etc

Pseudocode:
```
prover = algo.prover(sig, options)  // options may include prover_request if provided
prover.setProtected(base64(protected header))
prover.addPayload(payload1)
prover.addPayload(payload2, options)  // options may include proof_request if provided
prover.addPayload(payload3, options)
proof = prover.prove()
```

### Verifier Verifying

* Algo MAY support a prover-request object
  * support for custom nonce generation, etc
* Algo MAY also support per-payload proof-request objects
  * specific options such as range proofs, member proofs, etc 
* This local interface and transfer of these request items to the holder is out of scope of JWP
* addPayload behavior is similar to prover:
  * no payload no options == hidden or non-disclosed payload
  * payload and no options == fully revealed/disclosed payload, integrety protected
  * no payload with request options is algorithm specific, may be a PoK, predicate proof request, etc

```
verifier = algo.verifier(IK, options)  // options may include prover_request if used
verifier.setProtected(base64(protected header))
verifier.addPayload(payload1)
verifier.addPayload()
verifier.addPayload(payload3, options)  // options may include proof_request if used
ok = proof_verifier.prove()
```

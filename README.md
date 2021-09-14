# JWP scratch/experimentation area

Nothing here intended to be reusable, just for learning and testing.

The examples below may be out of date, don't use as an authoritative reference.

## Generic Algorigthm Interface

Exploring the API between a JWP implementation and the one or more proof algorithms internal to it.  This isn't intended for end applications, it's only the abstraction to the lower crypto engines, and as such it doesn't involve any overall container aspects.

### Issuer Signing

* JWP only requires serialization of the protected header
  * payloads are serialized by the algorithm as-needed
  * options are required per-payload that may be algo specific
  * for example, blinded payloads will just be an EC point
  * algo MUST provide integrity protection
* If the algo internally supports binding, that will be via signer options
* The algo internally structures which slot is used for the protected header
  * addPayload() must always be called in the same order across all usages

Pseudocode:
```
IK = issuer key
signer = algo.signer(IK, options)
signer.setProtected(base64(protected header))
signer.addPayload(payload1, options)
signer.addPayload(payload2, options)
signer.addPayload(payload3, options)
sig = signer.sign()
```

### Holder Verifying

* Algo MAY support a sign-request object
  * Generators/secrets for ephemeral binding and blinding options
  * Interface and transfer is out of scope of JWP

```
sig_verifier = algo.sig_verifier(IK, optional signing request)
sig_verifier.setProtected(base64(protected header))
sig_verifier.addPayload(payload1, options)
sig_verifier.addPayload(payload2, options)
sig_verifier.addPayload(payload3, options)
ok = sig_verifier.verify()
```

### Holder Deriving

* Similar to signing
* Deriver options MAY include algo specific items from the requesting verifier
  * Some algos require specific verifier nonce values to be used during the derivation
* For algos with internal binding support, deriver options would also contain keys/flags/etc
* Deriver addPayload() behavior:
  * no payload argument == hidden or non-disclosed payload
  * payload and no options == fully revealed/disclosed payload
  * payload with options is algorithm specific, may be a PoK, predicate proof request, etc

Pseudocode:
```
deriver = algo.deriver(sig, options)
deriver.setProtected(base64(protected header))
deriver.addPayload(payload1)
deriver.addPayload()
deriver.addPayload(payload3, options)
proof = deriver.derive()
```

### Verifier Verifying

* Algo MAY support a derive-request object
  * support for custom nonce generation, etc
* Algo MAY also support proof-request objects
  * specific options such as range proofs, member proofs, etc 
* This local interface and transfer of these request items to the holder is out of scope of JWP
* addPayload behavior is similar to derive:
  * no payload no options == hidden or non-disclosed payload
  * payload and no options == fully revealed/disclosed payload, integrety protected
  * no payload with request options is algorithm specific, may be a PoK, predicate proof request, etc

```
proof_verifier = algo.proof_verifier(IK, optional derive request)
proof_verifier.setProtected(base64(protected header))
proof_verifier.addPayload(payload1)
proof_verifier.addPayload()
proof_verifier.addPayload(payload3, optional payload request)
ok = proof_verifier.proove()
```


## Single-Use

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
    "crv": "P-256",
    "kty": "EC",
    "x": "GYYn5QE88mJr5k4iZMA9Mf_ep6Up3bIQbCK7yxVpVqA",
    "y": "v3BYSPbps_G61WITbCLuWlBVGHakkTAKyVc-jYATdwI",
    "kid": "Nh3OP-WGFVTRsUFef0qAv4vqoFWhhDVuSxcsDm4dikc",
    "alg": "SU-ES256",
    "use": "proof",
    "payloads": [
        {
            "claims": [
                "family_name",
                "given_name"
            ]
        },
        {
            "claims": [
                "email"
            ]
        },
        {
            "claims": [
                "birthdate"
            ]
        }
    ]
}
```

Protected
```json
{
    "kid": "Nh3OP-WGFVTRsUFef0qAv4vqoFWhhDVuSxcsDm4dikc",
    "issuer": "https://issuer.tld",
    "typ": "JOSE+Proof",
    "proof_jwk": {
        "crv": "P-256",
        "kty": "EC",
        "x": "WJuSSA2OgwyIphenelgtQe2fzyKFVaErGdOxn7ZYVTY",
        "y": "g3shvhwBncBJ9rK3TBdA53A2-FBFR1bok-xes7Yxqdg",
        "alg": "ES256"
    }
}
```

JWP
```json
{
    "payloads": [
        "eyJmYW1pbHlfbmFtZSI6Ik1pbGxlciIsImdpdmVuX25hbWUiOiJKZXIifQ",
        "eyJlbWFpbCI6ImplckBqZXJlbWllLmNvbSJ9",
        "eyJiaXJ0aGRhdGUiOiIyMDQyIn0"
    ],
    "protected": "eyJraWQiOiJOaDNPUC1XR0ZWVFJzVUZlZjBxQXY0dnFvRldoaERWdVN4Y3NEbTRkaWtjIiwiaXNzdWVyIjoiaHR0cHM6Ly9pc3N1ZXIudGxkIiwidHlwIjoiSk9TRStQcm9vZiIsInByb29mX2p3ayI6eyJjcnYiOiJQLTI1NiIsImt0eSI6IkVDIiwieCI6IldKdVNTQTJPZ3d5SXBoZW5lbGd0UWUyZnp5S0ZWYUVyR2RPeG43WllWVFkiLCJ5IjoiZzNzaHZod0JuY0JKOXJLM1RCZEE1M0EyLUZCRlIxYm9rLXhlczdZeHFkZyIsImFsZyI6IkVTMjU2In19",
    "proof": "oRzZG7Jbrm7Arbhq5A81r_SMYMLDwnYtxLgRr0K55mphcA2QNqA5GV7-rFHJGkX66zpDwG_qvAHGrxf1EeuiAkFZMWEj8sOhW-_NWrLprNddyraWtbll6vlpeKWmKB212wkL37-yeY3vFjlD9EIb-gl0n8Jyb5Yez2MYA8ZIZoyE6Cv48qlcFuOSBBB-YctDJRfjh3Lu001UMoKVfkLY0W7cW-c7WO2xBlPe5UYO-JtunGnuvQiYgxfDtwO9Jw5UvrXk8TGEYD317ekDV6Pl1qhWUyAIqCcscKjkrsi8j8oMDsGpPyVTu7tGIAXNC6CxwIdS6Jf-oSTeWkLnPFI7Ku13DPYh942oqnLbrdwjJDMw3H6zVY5bc5O3j-9lMnZ7Ef8JcP6Z8VJhgOcM3aDkSBYOVFKVcUlL7rEYadcD3ao"
}
```

## BBS

JWK
```json
{
    "kty": "OKP",
    "crv": "Bls12381G2",
    "x": "qM4Gi4razIIAXpDSlHB7-pPoo6GOChoBbSLxr7rNwb8mxyVykbmKQGNb0kI7iegDAs9cIwf6DAsCGi7BVs48MG-iw4PsP0L136g2gQpZjrKsr4GbkV5EIx0R2BjIJNfQ",
    "kid": "HjfcpyjuZQ-O8Ye2hQnNbT9RbbnrobptdnExR0DUjU8",
    "alg": "BBS",
    "use": "proof",
    "payloads": [
        {
            "claims": [
                "family_name",
                "given_name"
            ]
        },
        {
            "claims": [
                "email"
            ]
        },
        {
            "claims": [
                "birthdate"
            ]
        }
    ]
}
```

JWP
```json
{
    "protected": "eyJraWQiOiJIamZjcHlqdVpRLU84WWUyaFFuTmJUOVJiYm5yb2JwdGRuRXhSMERValU4IiwiaXNzdWVyIjoiaHR0cHM6Ly9pc3N1ZXIudGxkIiwidHlwIjoiSk9TRStQcm9vZiJ9",
    "payloads": [
        "eyJmYW1pbHlfbmFtZSI6Ik1pbGxlciIsImdpdmVuX25hbWUiOiJKZXIifQ",
        "eyJlbWFpbCI6ImplckBqZXJlbWllLmNvbSJ9",
        "eyJiaXJ0aGRhdGUiOiIyMDQyIn0"
    ],
    "proof": "rfU3qd1x1Z9xnxRRE_R6rCukTHR8YWEFIBqwcawgkbwlvBMKGP1B_mAYiF-tbe8VYUHlKfzccE4m7waZyoLEkBLFiK2g54Q2i-CdtYBgDdkUDsoULSBMcH1MwGHwdjfXpldFNFrHFx_IAvLVniyeMQ"
}
```

Protected
```json
{
    "kid": "HjfcpyjuZQ-O8Ye2hQnNbT9RbbnrobptdnExR0DUjU8",
    "issuer": "https://issuer.tld",
    "typ": "JOSE+Proof"
}
```

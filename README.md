# JWP scratch/experimentation area

Nothing here intended to be reusable, just for learning and testing.

## Single-Use

These are likely to be out of date, don't use as a reference.

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

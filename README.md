# JWP scratch/experimentation area

Nothing here intended to be reusable, just for learning and testing.

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
  "x": "sc9sq4tfzYuBSzscCFqdt9MdY2q6EwHcWmld_mKyaOE",
  "y": "KO5y4om5dwuNn_4zk_hKns3YXH0fbq2K-Awp6ikwRVc",
  "crv": "P-256",
  "kid": "j_Qk9HpoLTpP0dnTqruqK9hMVsKQSx8W9o73x1X9b2I",
  "alg": "SU-ES256",
  "use": "proof",
  "lyt": {
    "family_name": [0],
    "given_name": [1],
    "email": [2],
    "age": [3]
  }
}
```

Protected Header
```json
  {"kid": "j_Qk9HpoLTpP0dnTqruqK9hMVsKQSx8W9o73x1X9b2I",
  "iss": "https://issuer.tld"
}
```


JWP JSON
```json
{
  "protected": "eyJraWQiOiJqX1FrOUhwb0xUcFAwZG5UcXJ1cUs5aE1Wc0tRU3g4VzlvNzN4MVg5YjJJIiwiaXNzIjoiaHR0cHM6Ly9pc3N1ZXIudGxkIn0",
  "payloads": [
    "Ik1pbGxlciI",
    "IkplcmVtaWUi",
    "ImplckBqZXJlbWllLmNvbSI",
    "NDI"
  ],
  "proof": "bHlkva5uqXN66qMIE5yQX8uUY_vPddhTOvJSPXWQNUYNv34AozdbfJMc8NVMfuixwniz6DFMXNgqYlpWoGZCOPjBrWTlDnl6rsO0I9oB5q3eOimFnZnXrg6WcQaOBS1-V9eniFKhl9DWTm5EVeqfNbBKRTgDxQBcX3Nc0gPND4QtM22kSZphvfmdX_7_ihuT89FuM-0Tm6pjcIRSaFw01QzeXdM0Y5K0QhrtDu2mK6hua2w48pZ6Dag_ATexLV4o1yIHPuMsQIQu2CdfdKpq6RGSz2rImelYHR8_i7m8dZCuEst_AaWMxQqE6VtqnhV0m1BVIRKpfe4me1130n7sc8r74zv9f7xAhM1WQjdh1v4BkeVN3YE83sU3D61o1wKCiK9TVw_0vdBJD7OaWrmHbVcTvyigQyvkkqtngtGOgGj8AHi9d8LcyAT2ARO-p5iAOfBsWbB47XFP0SXdHB-7ejAcgIOyJ7DwRNPXQK_1KyvqBfRxGnTPW_F00Z9gF-4m"
}
```

JWP Compact
```
ImV5SnJhV1FpT2lKcVgxRnJPVWh3YjB4VWNGQXdaRzVVY1hKMWNVczVhRTFXYzB0UlUzZzRWemx2TnpONE1WZzVZakpKSWl3aWFYTnpJam9pYUhSMGNITTZMeTlwYzNOMVpYSXVkR3hrSW4wIg.Ik1pbGxlciI~IkplcmVtaWUi~ImplckBqZXJlbWllLmNvbSI~NDI.bHlkva5uqXN66qMIE5yQX8uUY_vPddhTOvJSPXWQNUYNv34AozdbfJMc8NVMfuixwniz6DFMXNgqYlpWoGZCOPjBrWTlDnl6rsO0I9oB5q3eOimFnZnXrg6WcQaOBS1-V9eniFKhl9DWTm5EVeqfNbBKRTgDxQBcX3Nc0gPND4QtM22kSZphvfmdX_7_ihuT89FuM-0Tm6pjcIRSaFw01QzeXdM0Y5K0QhrtDu2mK6hua2w48pZ6Dag_ATexLV4o1yIHPuMsQIQu2CdfdKpq6RGSz2rImelYHR8_i7m8dZCuEst_AaWMxQqE6VtqnhV0m1BVIRKpfe4me1130n7sc8r74zv9f7xAhM1WQjdh1v4BkeVN3YE83sU3D61o1wKCiK9TVw_0vdBJD7OaWrmHbVcTvyigQyvkkqtngtGOgGj8AHi9d8LcyAT2ARO-p5iAOfBsWbB47XFP0SXdHB-7ejAcgIOyJ7DwRNPXQK_1KyvqBfRxGnTPW_F00Z9gF-4m
```

# BBS

JWK
```json
{
  "kty": "OKP",
  "crv": "Bls12381G2",
  "x": "rH-OP420WFf4TmOgfbmsFu4YLVTDDcCYwApM04NlLEJDF2dcjDLduHhbt2npqg8gCuxUcXyQH7rCPssBNtJDzjRgs2p8L9L0DZYSIU--MeH-cyui1MKFaxlJz6N8hfKY",
  "kid": "m-noJoLMgMuXl5NJ-IkPi-NbureQB3qrFBCo88gnSjA",
  "alg": "BBS+",
  "use": "proof",
  "lyt": {
    "family_name": [0],
    "given_name": [1],
    "email": [2],
    "age": [3]
  }
}
```

Protected Header
```json
{
  "kid": "m-noJoLMgMuXl5NJ-IkPi-NbureQB3qrFBCo88gnSjA",
  "issuer": "https://issuer.tld"
}
```

JWP JSON
```json
{
  "protected": "eyJraWQiOiJtLW5vSm9MTWdNdVhsNU5KLUlrUGktTmJ1cmVRQjNxckZCQ284OGduU2pBIiwiaXNzdWVyIjoiaHR0cHM6Ly9pc3N1ZXIudGxkIn0",
  "payloads": [
    "Ik1pbGxlciI",
    "IkplcmVtaWUi",
    "ImplckBqZXJlbWllLmNvbSI",
    "NDI"
  ],
  "proof": "okgCB3-zyXlWBRQtv8of3I8WfksTZe0Ls-eiFWH1lAhWI6kAw51kdOuubQS-AkPeYUHlKfzccE4m7waZyoLEkBLFiK2g54Q2i-CdtYBgDdkUDsoULSBMcH1MwGHwdjfXpldFNFrHFx_IAvLVniyeMQ"
}
```

JWP Compact
```
ImV5SnJhV1FpT2lKdExXNXZTbTlNVFdkTmRWaHNOVTVLTFVsclVHa3RUbUoxY21WUlFqTnhja1pDUTI4NE9HZHVVMnBCSWl3aWFYTnpkV1Z5SWpvaWFIUjBjSE02THk5cGMzTjFaWEl1ZEd4a0luMCI.Ik1pbGxlciI~IkplcmVtaWUi~ImplckBqZXJlbWllLmNvbSI~NDI.okgCB3-zyXlWBRQtv8of3I8WfksTZe0Ls-eiFWH1lAhWI6kAw51kdOuubQS-AkPeYUHlKfzccE4m7waZyoLEkBLFiK2g54Q2i-CdtYBgDdkUDsoULSBMcH1MwGHwdjfXpldFNFrHFx_IAvLVniyeMQ
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

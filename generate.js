
const { fromKeyLike } = require('jose/jwk/from_key_like');
const { generateKeyPair } = require('jose/util/generate_key_pair');


(async function(){
    const { publicKey, privateKey } = await generateKeyPair('ES256')
    const privateJwk = await fromKeyLike(privateKey)
    const publicJwk = await fromKeyLike(publicKey)
    console.log(publicJwk)
})()


var jwk = {
    "kty": "EC",
    "use": "proof",
    "kid": "DmKUhnuH8xT1-diSYr9IcLT0RjEk8zy1UKv1GqiZXvA",
    "alg": "SU-ES256",
    "crv": "P-256",
    "x": "uOVtCeW5z2G9nJYoXgpES6Gj8BXut5ydHMGki1iBURo",
    "y": "reGCTZg6iFWpuSB0DfOK7YaF75fa732PiyWEZ35BI3I",
    "payloads":[
        {"claims":["family_name", "given_name"]},
        {"claims":["email"]},
        {"claims":["birthdate"]},
        {"claims":["age"], "cty":"hashchain-commitment"},
        {"claims":["profile_pic"], "cty":"image/png"}
     ]  
}

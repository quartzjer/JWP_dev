
const { fromKeyLike } = require('jose/jwk/from_key_like');
const { generateKeyPair } = require('jose/util/generate_key_pair');
const { calculateThumbprint } = require('jose/jwk/thumbprint');
const { encode, decode } = require('jose/util/base64url');
const { readFileSync } = require('fs');
const { GeneralSign } = require('jose/jws/general/sign');


// hack working around jose wrapper
async function sign_payload(payload, key){
    const sig = new GeneralSign(decode(payload));
    sig.addSignature(key).setProtectedHeader({'alg':'ES256'});
    const jws = await sig.sign();
    return jws.signatures[0].signature;
}

(async function(){
    // generate the long-term public key
    const signer = await generateKeyPair('ES256');
    const jwk = await fromKeyLike(signer.publicKey);
    jwk.kid = await calculateThumbprint(jwk);
    jwk.alg = 'ES256';
    jwk.alg = 'SU-' + jwk.alg;
    jwk.use = 'proof';
    console.log(JSON.stringify(jwk,0,2));

    // generate the ephemeral key
    const ephemeral = await generateKeyPair('ES256');
    const ejwk = await fromKeyLike(ephemeral.publicKey);
    ejwk.alg = 'ES256';

    const jwp = {payloads:[]};
    const protected = {};
    protected.kid = jwk.kid;
    protected.iss = 'https://issuer.tld';
    protected.claims = ['family_name', 'given_name', 'email', 'age']
    //protected.typ = 'JOSE+Proof';
    //protected.proof_jwk = ejwk;
    console.log(JSON.stringify(protected, 0, 2));

    jwp.protected = encode(JSON.stringify(protected));
    jwp.payloads.push(encode(JSON.stringify('Miller')));
    jwp.payloads.push(encode(JSON.stringify('Jeremie')));
    jwp.payloads.push(encode(JSON.stringify('jer@jeremie.com')));
    jwp.payloads.push(encode(JSON.stringify(42)));

    
    const sigs = [];
    let signature = await sign_payload(jwp.protected, ephemeral.privateKey);
    sigs.push(signature);
    for(payload of jwp.payloads)
    {
        signature = await sign_payload(payload, ephemeral.privateKey);
        sigs.push(signature);
    }
    let final = Buffer.from([]);
    for(sig of sigs)
    {
        final = Buffer.concat([final, decode(sig)]);
    }
    const final_sig = await sign_payload(encode(final), signer.privateKey);
    final = Buffer.concat([final, decode(final_sig)]);
    jwp.proof = encode(final);
    console.log(JSON.stringify(jwp,0,2));


    const serialized = [];
    serialized.push(encode(JSON.stringify(jwp.protected)));
    serialized.push(jwp.payloads.join('~'));
    serialized.push(jwp.proof);
    console.log(serialized.join('.'));
    
})();

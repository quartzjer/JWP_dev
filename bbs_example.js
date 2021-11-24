const {
    generateBls12381G2KeyPair,
    blsSign,
    blsVerify,
    blsCreateProof,
    blsVerifyProof,
  } = require('@mattrglobal/bbs-signatures');

const { fromKeyLike } = require('jose/jwk/from_key_like');
const { generateKeyPair } = require('jose/util/generate_key_pair');
const { calculateThumbprint } = require('jose/jwk/thumbprint');
const { encode, decode } = require('jose/util/base64url');
const { readFileSync } = require('fs');
const { GeneralSign } = require('jose/jws/general/sign');


(async function(){
    // generate the long-term public key
    const keyPair = await generateBls12381G2KeyPair();

    const jwk = {};
    jwk.kty = 'OKP';
    jwk.crv = 'Bls12381G2';
    jwk.x = Buffer.from(keyPair.publicKey).toString('base64url');
    jwk.kid = await calculateThumbprint(jwk);
    jwk.alg = 'BBS+';
    jwk.use = 'proof';
    jwk.lyt = {
        'family_name':[0],
        'given_name':[1],
        'email':[2],
        'age':[3]
    }
    console.log(JSON.stringify(jwk,0,2));

    // generate jwp
    const jwp = {};
    const protected = {};
    protected.kid = jwk.kid;
    protected.issuer = 'https://issuer.tld';
//    protected.typ = 'JOSE+Proof';
    const protected_buff = Buffer.from(JSON.stringify(protected), 'utf8');
    jwp.protected = encode(protected_buff);
    const payloads_buff = [
        Buffer.from(JSON.stringify('Miller'), 'utf8'),
        Buffer.from(JSON.stringify('Jeremie'), 'utf8'),
        Buffer.from(JSON.stringify('jer@jeremie.com'), 'utf8'),
        Buffer.from(JSON.stringify(42), 'utf8')
    ];
    jwp.payloads = payloads_buff.map(encode);
    
    let messages = [];
    messages.push(Uint8Array.from(protected_buff));
    messages.concat(payloads_buff.map((item)=>Uint8Array.from(item)));
    const signature = await blsSign({
        keyPair,
        messages
    });
  
    jwp.proof = encode(signature);
    console.log(JSON.stringify(jwp,0,2));

    const serialized = [];
    serialized.push(encode(JSON.stringify(jwp.protected)));
    serialized.push(jwp.payloads.join('~'));
    serialized.push(jwp.proof);
    console.log(serialized.join('.'));


})();

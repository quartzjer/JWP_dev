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
    console.log('JWK:');
    console.log(JSON.stringify(jwk,0,2));

    // generate jwp
    const jwp = {};
    const protected = {};
    protected.typ = 'JPT';
    protected.alg = jwk.alg;
//    protected.kid = jwk.kid;
//    protected.issuer = 'https://issuer.tld';
    protected.claims = ['family_name', 'given_name', 'email', 'age']
    console.log()
    console.log('Protected Header:');
    console.log(JSON.stringify(protected, 0, 2));

    const protected_buff = Buffer.from(JSON.stringify(protected), 'utf8');
    jwp.protected = encode(protected_buff);
    const payloads_buff = [
        Buffer.from(JSON.stringify('Doe'), 'utf8'),
        Buffer.from(JSON.stringify('Jay'), 'utf8'),
        Buffer.from(JSON.stringify('jaydoe@example.org'), 'utf8'),
        Buffer.from(JSON.stringify(42), 'utf8')
    ];
    jwp.payloads = payloads_buff.map(encode);
    
    let messages = [];
    messages.push(Uint8Array.from(protected_buff));
    messages = messages.concat(payloads_buff.map((item)=>Uint8Array.from(item)));
    const signature = await blsSign({
        keyPair,
        messages
    });
  
    jwp.proof = encode(signature);
    console.log()
    console.log('JSON Serialization:');
    console.log(JSON.stringify(jwp,0,2));

    const serialized = [];
    serialized.push(encode(JSON.stringify(jwp.protected)));
    serialized.push(jwp.payloads.join('~'));
    serialized.push(jwp.proof);
    console.log()
    console.log('Compact Serialization:');
    console.log(serialized.join('.'));

    // generate a proof with selective disclosure of only the name and age
    const proof = await blsCreateProof({
        signature,
        publicKey: keyPair.publicKey,
        messages,
        nonce: Uint8Array.from(Buffer.from("nonce", "utf8")),
        revealed: [0,2,4],
    });
    jwp.payloads[0] = '';
    jwp.payloads[2] = '';

    const presentation = [];
    presentation.push(encode(JSON.stringify(jwp.protected)));
    presentation.push(jwp.payloads.join('~'));
    presentation.push(encode(proof));
    console.log()
    console.log('Compact Presentation:');
    console.log(presentation.join('.'));
      

})();

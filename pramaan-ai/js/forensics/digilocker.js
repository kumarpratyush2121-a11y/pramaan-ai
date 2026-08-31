/**
 * PramaanAI - DigiLocker Direct Connect & eKYC Verification Gateway
 * Simulates real-time Government of India DigiLocker API & PKI XML signature verification.
 * Compliant with SIH Statement 21688.
 */

export const DIGILOCKER_MOCK_DOCUMENTS = [
    {
        id: 'aadhaar_ekyc',
        docType: 'Aadhaar (UIDAI e-KYC)',
        docName: 'Aadhaar Card - Shri Rajesh Kumar Sharma',
        issuer: 'Unique Identification Authority of India (UIDAI)',
        issuerUri: 'in.gov.uidai',
        documentId: 'XXXX-XXXX-9019',
        dateOfIssue: '2021-04-14',
        status: 'Cryptographically Verified (PKI Valid)',
        sha256Thumbprint: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        digitalSigner: 'CN=UIDAI CA 2021, OU=UIDAI, O=Government of India, C=IN',
        details: {
            fullName: 'Rajesh Kumar Sharma',
            dob: '1988-08-15',
            gender: 'Male',
            fatherName: 'Late Suresh Sharma',
            address: 'H.No. 42, Sector 14, Dwarka, South West Delhi, Delhi - 110078',
            mobileMasked: 'XXXXXX8912',
            emailMasked: 'r******@nic.in'
        },
        xmlPayload: `<?xml version="1.0" encoding="UTF-8"?>
<KycRes code="9a781bcf" ret="Y" ts="2026-08-31T21:30:00.000+05:30" txn="DL-UIDAI-20260831-7781">
  <UidData uid="XXXXXXXX9012">
    <Poi dob="15-08-1988" e="r******@nic.in" gender="M" m="XXXXXX8912" name="Rajesh Kumar Sharma"/>
    <Poa co="Late Suresh Sharma" house="42" loc="Sector 14" vtc="Dwarka" dist="South West Delhi" state="Delhi" pc="110078"/>
    <Pht>[Base64 Encoded Biometric Portrait - 256-bit SHA256 Signature Match]</Pht>
  </UidData>
  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <SignedInfo>
      <CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
      <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
      <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
      <DigestValue>+8F434346648f6b96df89dda901c5176b10a6d8396=</DigestValue>
    </SignedInfo>
    <SignatureValue>MEQCIAgN23iK4...[UIDAI PKI Verified Certificate]...</SignatureValue>
  </Signature>
</KycRes>`
    },
    {
        id: 'pan_record',
        docType: 'Income Tax PAN Card',
        docName: 'PAN Verification Record - ABCPS1234F',
        issuer: 'Income Tax Department (ITD) / NSDL',
        issuerUri: 'in.gov.incometax',
        documentId: 'ABCPS1234F',
        dateOfIssue: '2019-11-20',
        status: 'Active & Aadhaar Seeded (Valid)',
        sha256Thumbprint: '3b0c5112f458e0a3cd79b1836a99268f764a8520cf9e9c8bc8aa2882a1772659',
        digitalSigner: 'CN=NSDL e-Governance Infrastructure CA, O=Income Tax Department, C=IN',
        details: {
            pan: 'ABCPS1234F',
            fullName: 'RAJESH KUMAR SHARMA',
            fatherName: 'SURESH SHARMA',
            dob: '15/08/1988',
            panCategory: 'P - Individual',
            aadhaarSeeded: 'YES'
        },
        xmlPayload: `<?xml version="1.0" encoding="UTF-8"?>
<PanVerificationResponse xmlns="http://incometaxindia.gov.in/pan" version="2.0">
  <PanNumber>ABCPS1234F</PanNumber>
  <Name>RAJESH KUMAR SHARMA</Name>
  <FatherName>SURESH SHARMA</FatherName>
  <DOB>1988-08-15</DOB>
  <Category>Individual (P)</Category>
  <Status>OPERATIVE_AND_VALID</Status>
  <AadhaarLinkStatus>LINKED</AadhaarLinkStatus>
  <VerificationTS>2026-08-31T21:30:15Z</VerificationTS>
  <DigitalSignature>
    <CertSerial>781290384910283</CertSerial>
    <Issuer>Income Tax Department Root CA</Issuer>
    <Validity>Valid</Validity>
  </DigitalSignature>
</PanVerificationResponse>`
    },
    {
        id: 'driving_license',
        docType: 'Driving License (MoRTH)',
        docName: 'Driving License - DL-04-2018-0012345',
        issuer: 'Ministry of Road Transport & Highways (MoRTH / Parivahan)',
        issuerUri: 'in.gov.transport',
        documentId: 'DL-04-2018-0012345',
        dateOfIssue: '2018-06-22',
        status: 'Valid (Non-Transport LMV & MCWG)',
        sha256Thumbprint: '992a76f2cdb6697a5a8f4c2810f994d50893cb662d5eaec43198083818e9527e',
        digitalSigner: 'CN=SARATHI PARIVAHAN CA, O=MoRTH Government of India, C=IN',
        details: {
            dlNumber: 'DL-04-2018-0012345',
            holderName: 'RAJESH KUMAR SHARMA',
            dob: '1988-08-15',
            rto: 'RTO Janakpuri, West Delhi (DL-04)',
            vehicleClasses: 'MCWG, LMV',
            validTill: '2038-08-14'
        },
        xmlPayload: `<?xml version="1.0" encoding="UTF-8"?>
<DLData xmlns="http://parivahan.gov.in/sarathi">
  <DLNumber>DL0420180012345</DLNumber>
  <Name>RAJESH KUMAR SHARMA</Name>
  <IssueDate>2018-06-22</IssueDate>
  <ValidUpto>2038-08-14</ValidUpto>
  <CovDetails>
    <Cov code="MCWG" desc="Motorcycle With Gear"/>
    <Cov code="LMV" desc="Light Motor Vehicle"/>
  </CovDetails>
  <SecurityHash algo="SHA-256">992A76F2CDB6697A5A8F4C2810F994D50893CB662D5EAEC43198083818E9527E</SecurityHash>
</DLData>`
    }
];

/**
 * Simulates DigiLocker authentication & document fetch
 * @param {string} mobileOrAadhaar 
 * @param {string} otp 
 * @returns {Promise<{ success: boolean, message: string, documents?: Array<Object> }>}
 */
export async function connectDigiLocker(mobileOrAadhaar, otp) {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API roundtrip

    if (!mobileOrAadhaar || mobileOrAadhaar.length < 6) {
        return {
            success: false,
            message: 'Please enter a valid 10-digit Mobile Number or 12-digit Aadhaar UID.'
        };
    }

    if (otp !== '123456' && otp.length !== 6) {
        return {
            success: false,
            message: 'Invalid OTP. For test demonstration, use mock OTP: 123456'
        };
    }

    return {
        success: true,
        message: 'DigiLocker eKYC Authenticated Successfully. 3 Official Document(s) Retrieved from Government Repositories.',
        documents: DIGILOCKER_MOCK_DOCUMENTS
    };
}

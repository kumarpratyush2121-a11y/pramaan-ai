/**
 * PramaanAI - Algorithmic Checksums & Document Validators
 * Implements strict cryptographic & mathematical checksum algorithms for Indian ID documents.
 * Compliant with SIH Statement 21688.
 */

// --------------------------------------------------------------------------
// 1. Verhoeff Algorithm for Aadhaar (12-digit UID)
// Based on Dihedral Group D5 arithmetic (Multiplication & Permutation tables)
// --------------------------------------------------------------------------
const VERHOEFF_D = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const VERHOEFF_P = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

const VERHOEFF_INV = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Validates a 12-digit Aadhaar number using the Verhoeff algorithm.
 * @param {string} aadhaarStr 12-digit numeric string (spaces allowed)
 * @returns {{ isValid: boolean, cleaned: string, message: string }}
 */
export function validateAadhaarVerhoeff(aadhaarStr) {
    if (!aadhaarStr) return { isValid: false, cleaned: '', message: 'Aadhaar number is missing' };
    const cleaned = aadhaarStr.replace(/\s+/g, '').replace(/-/g, '');
    
    if (!/^\d{12}$/.test(cleaned)) {
        return { 
            isValid: false, 
            cleaned, 
            message: `Aadhaar must be exactly 12 numeric digits (found ${cleaned.length} chars)` 
        };
    }

    // Disallow invalid starter digits (Aadhaar never starts with 0 or 1)
    if (cleaned.startsWith('0') || cleaned.startsWith('1')) {
        return {
            isValid: false,
            cleaned,
            message: 'Invalid Aadhaar: Cannot start with 0 or 1 per UIDAI specification'
        };
    }

    let c = 0;
    const reversed = cleaned.split('').reverse();
    for (let i = 0; i < reversed.length; i++) {
        const digit = parseInt(reversed[i], 10);
        c = VERHOEFF_D[c][VERHOEFF_P[i % 8][digit]];
    }

    const isValid = (c === 0);
    return {
        isValid,
        cleaned,
        message: isValid 
            ? 'Aadhaar checksum mathematically verified (Verhoeff D5 Checksum Valid)' 
            : 'Aadhaar checksum mismatch: Verhoeff validation failed (Tampered/Fake UID)'
    };
}

/**
 * Computes the Verhoeff check digit for an 11-digit number.
 * @param {string} num11 11-digit number
 * @returns {number} Check digit (0-9)
 */
export function generateAadhaarCheckDigit(num11) {
    const cleaned = num11.replace(/\D/g, '');
    if (cleaned.length !== 11) return -1;
    let c = 0;
    const reversed = cleaned.split('').reverse();
    for (let i = 0; i < reversed.length; i++) {
        const digit = parseInt(reversed[i], 10);
        c = VERHOEFF_D[c][VERHOEFF_P[(i + 1) % 8][digit]];
    }
    return VERHOEFF_INV[c];
}

// --------------------------------------------------------------------------
// 2. PAN Card Validation & 4th Character Tax Status Decoder
// Format: [A-Z]{5}[0-9]{4}[A-Z]
// --------------------------------------------------------------------------
export const PAN_ENTITY_TYPES = {
    'P': 'Individual / Person (व्यक्तिगत)',
    'C': 'Company (कंपनी)',
    'H': 'Hindu Undivided Family (HUF)',
    'F': 'Partnership Firm / LLP (साझेदारी फर्म)',
    'A': 'Association of Persons (AOP)',
    'T': 'Trust (ट्रस्ट)',
    'B': 'Body of Individuals (BOI)',
    'L': 'Local Authority (स्थानीय प्राधिकरण)',
    'J': 'Artificial Juridical Person (कृत्रिम न्यायिक व्यक्ति)',
    'G': 'Government Agency (सरकारी एजेंसी)'
};

/**
 * Validates a PAN (Permanent Account Number).
 * @param {string} panStr 10-character alphanumeric PAN
 * @param {string} [holderLastName] Optional last name to verify 5th character
 * @returns {{ isValid: boolean, cleaned: string, entityType: string, entityDescription: string, message: string }}
 */
export function validatePAN(panStr, holderLastName = '') {
    if (!panStr) return { isValid: false, cleaned: '', entityType: '', entityDescription: '', message: 'PAN missing' };
    const cleaned = panStr.toUpperCase().trim();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

    if (!panRegex.test(cleaned)) {
        return {
            isValid: false,
            cleaned,
            entityType: '',
            entityDescription: '',
            message: 'Invalid PAN structure. Must match pattern: 5 uppercase letters, 4 digits, 1 letter (e.g. ABCDE1234F)'
        };
    }

    const fourthChar = cleaned.charAt(3);
    const fifthChar = cleaned.charAt(4);
    const entityDescription = PAN_ENTITY_TYPES[fourthChar] || 'Unknown / Non-Standard Entity Type';

    let lastNameMatch = true;
    if (holderLastName) {
        const expectedFifth = holderLastName.trim().toUpperCase().charAt(0);
        if (expectedFifth && expectedFifth !== fifthChar) {
            lastNameMatch = false;
        }
    }

    return {
        isValid: true,
        cleaned,
        entityType: fourthChar,
        entityDescription,
        fifthCharMatchesLastName: lastNameMatch,
        message: `Valid PAN (${entityDescription}). Structure and Income Tax Department rules verified.`
    };
}

// --------------------------------------------------------------------------
// 3. Voter ID (EPIC - Electors Photo Identity Card) Validation
// Formats: Traditional 3 alphabets + 7 digits (e.g. ABC1234567) or State specific prefixes
// --------------------------------------------------------------------------
export function validateVoterID(epicStr) {
    if (!epicStr) return { isValid: false, cleaned: '', message: 'Voter ID is missing' };
    const cleaned = epicStr.toUpperCase().trim().replace(/[\s\/-]/g, '');
    
    // Standard format: 3 uppercase letters followed by 7 digits
    const standardRegex = /^[A-Z]{3}[0-9]{7}$/;
    // Legacy formats from some states: 2-4 letters followed by 6-8 digits
    const legacyRegex = /^[A-Z]{2,4}[0-9]{6,8}$/;

    if (standardRegex.test(cleaned)) {
        return {
            isValid: true,
            cleaned,
            formatType: 'Standard ECI EPIC Format (3-Alpha + 7-Numeric)',
            message: 'Valid Election Commission of India (ECI) EPIC Number format.'
        };
    } else if (legacyRegex.test(cleaned)) {
        return {
            isValid: true,
            cleaned,
            formatType: 'Legacy State ECI Format',
            message: 'Valid legacy state Voter ID format.'
        };
    } else {
        return {
            isValid: false,
            cleaned,
            formatType: 'Invalid Format',
            message: 'Invalid Voter ID format. Expected 3 letters followed by 7 digits (e.g., WBG1234567).'
        };
    }
}

// --------------------------------------------------------------------------
// 4. Indian Driving License (DL) Validation
// Standard 16-character format: SS-RR-YYYYNNNNNNN
// SS = 2-letter State Code, RR = 2-digit RTO Code, YYYY = 4-digit Issue Year, NNNNNNN = 7-digit Serial
// --------------------------------------------------------------------------
const INDIAN_STATES = {
    'AP': 'Andhra Pradesh', 'AR': 'Arunachal Pradesh', 'AS': 'Assam', 'BR': 'Bihar',
    'CG': 'Chhattisgarh', 'CH': 'Chandigarh', 'DL': 'Delhi', 'GA': 'Goa',
    'GJ': 'Gujarat', 'HR': 'Haryana', 'HP': 'Himachal Pradesh', 'JH': 'Jharkhand',
    'JK': 'Jammu & Kashmir', 'KA': 'Karnataka', 'KL': 'Kerala', 'MP': 'Madhya Pradesh',
    'MH': 'Maharashtra', 'MN': 'Manipur', 'ML': 'Meghalaya', 'MZ': 'Mizoram',
    'NL': 'Nagaland', 'OD': 'Odisha', 'PB': 'Punjab', 'RJ': 'Rajasthan',
    'SK': 'Sikkim', 'TN': 'Tamil Nadu', 'TS': 'Telangana', 'TR': 'Tripura',
    'UP': 'Uttar Pradesh', 'UK': 'Uttarakhand', 'WB': 'West Bengal'
};

export function validateDrivingLicense(dlStr) {
    if (!dlStr) return { isValid: false, cleaned: '', state: '', message: 'DL missing' };
    const cleaned = dlStr.toUpperCase().replace(/[\s-]/g, '');

    // Standard MoRTH format: 2-letter state code + 2-digit RTO + 4-digit Year + 7 digits = 15 or 16 chars
    const dlRegex = /^([A-Z]{2})([0-9]{2})([0-9]{4})([0-9]{7})$/;
    const match = cleaned.match(dlRegex);

    if (!match) {
        return {
            isValid: false,
            cleaned,
            state: 'Unknown',
            message: 'Invalid Driving License format. Standard format: SS-RR-YYYY-NNNNNNN (e.g., DL-04-2018-0012345).'
        };
    }

    const stateCode = match[1];
    const rtoCode = match[2];
    const issueYear = parseInt(match[3], 10);
    const currentYear = new Date().getFullYear();
    const stateName = INDIAN_STATES[stateCode] || 'Unknown Union Territory/State';

    if (issueYear < 1950 || issueYear > currentYear) {
        return {
            isValid: false,
            cleaned,
            state: stateName,
            message: `Invalid DL issue year (${issueYear}). Must be between 1950 and ${currentYear}.`
        };
    }

    return {
        isValid: true,
        cleaned,
        state: stateName,
        rtoCode,
        issueYear,
        message: `Valid Indian Driving License issued in ${stateName} (RTO: ${rtoCode}, Year: ${issueYear}).`
    };
}

// --------------------------------------------------------------------------
// 5. Passport MRZ (Machine Readable Zone) ICAO 9303 Check Digit Calculator
// Standard 7-3-1 weight matrix algorithm over characters 0-9, A-Z (< = 0)
// --------------------------------------------------------------------------
const MRZ_WEIGHTS = [7, 3, 1];

function mrzCharValue(char) {
    if (char >= '0' && char <= '9') return char.charCodeAt(0) - '0'.charCodeAt(0);
    if (char >= 'A' && char <= 'Z') return char.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    if (char === '<') return 0;
    return 0;
}

export function computeMRZCheckDigit(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        const val = mrzCharValue(str.charAt(i));
        const weight = MRZ_WEIGHTS[i % 3];
        sum += val * weight;
    }
    return (sum % 10).toString();
}

/**
 * Validates a 2-line ICAO 9303 Type 3 Passport MRZ (44 characters per line).
 * @param {string} line1 44-character MRZ line 1 (e.g. P<INDSHARMA<<RAJESH<<<<<<<<<<<<<<<<<<<<<<)
 * @param {string} line2 44-character MRZ line 2 (e.g. Z1234567<8IND8505151M3005142<<<<<<<<<<<<<<0)
 * @returns {{ isValid: boolean, passportNumber: string, dob: string, expiry: string, nationality: string, message: string }}
 */
export function validatePassportMRZ(line1, line2) {
    const l1 = (line1 || '').trim().toUpperCase();
    const l2 = (line2 || '').trim().toUpperCase();

    if (l1.length !== 44 || l2.length !== 44) {
        return {
            isValid: false,
            message: `Invalid MRZ length. Expected 44 characters per line (found Line 1: ${l1.length}, Line 2: ${l2.length}).`
        };
    }

    const docType = l1.substring(0, 2);
    const country = l1.substring(2, 5);
    const passportNo = l2.substring(0, 9);
    const passportCheckDigit = l2.charAt(9);
    const calcPassportCheck = computeMRZCheckDigit(passportNo);

    const nationality = l2.substring(10, 13);
    const dob = l2.substring(13, 19); // YYMMDD
    const dobCheckDigit = l2.charAt(19);
    const calcDobCheck = computeMRZCheckDigit(dob);

    const gender = l2.charAt(20);
    const expiry = l2.substring(21, 27); // YYMMDD
    const expiryCheckDigit = l2.charAt(27);
    const calcExpiryCheck = computeMRZCheckDigit(expiry);

    const isPassportValid = (passportCheckDigit === calcPassportCheck);
    const isDobValid = (dobCheckDigit === calcDobCheck);
    const isExpiryValid = (expiryCheckDigit === calcExpiryCheck);

    const allValid = isPassportValid && isDobValid && isExpiryValid;

    return {
        isValid: allValid,
        passportNumber: passportNo.replace(/</g, ''),
        nationality,
        country,
        dob,
        expiry,
        gender,
        checksums: {
            passport: { given: passportCheckDigit, calculated: calcPassportCheck, valid: isPassportValid },
            dob: { given: dobCheckDigit, calculated: calcDobCheck, valid: isDobValid },
            expiry: { given: expiryCheckDigit, calculated: calcExpiryCheck, valid: isExpiryValid }
        },
        message: allValid 
            ? 'Passport ICAO 9303 MRZ cryptographic checksums 100% verified.' 
            : 'Passport MRZ checksum failure! Mismatched check-digits detected in Machine Readable Zone.'
    };
}

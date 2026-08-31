/**
 * PramaanAI - Synthetic Demo Specimen Generator
 * Generates realistic specimen documents (Aadhaar, PAN, Voter ID, Reference Photos)
 * completely client-side with zero external image dependencies for seamless Netlify Drop demos.
 * Compliant with SIH Statement 21688.
 */

/**
 * Creates an avatar/face drawing on a canvas
 */
function drawFaceAvatar(ctx, x, y, size, isAlternate = false) {
    ctx.save();
    // Background
    ctx.fillStyle = isAlternate ? '#d1d5db' : '#bfdbfe';
    ctx.fillRect(x, y, size, size * 1.25);
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size * 1.25);

    // Head
    const centerX = x + size / 2;
    const centerY = y + size * 0.48;
    const headRad = size * 0.28;

    // Hair
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 6, headRad + 3, Math.PI, 0, false);
    ctx.fill();

    // Face skin
    ctx.fillStyle = isAlternate ? '#e0a96d' : '#eec590';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, headRad * 0.9, headRad * 1.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8d5b2d';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#111827';
    const eyeSpacing = headRad * 0.42;
    const eyeY = centerY - 4;
    ctx.beginPath();
    ctx.arc(centerX - eyeSpacing, eyeY, 3.5, 0, Math.PI * 2);
    ctx.arc(centerX + eyeSpacing, eyeY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - eyeSpacing - 5, eyeY - 7);
    ctx.lineTo(centerX - eyeSpacing + 5, eyeY - 6);
    ctx.moveTo(centerX + eyeSpacing - 5, eyeY - 6);
    ctx.lineTo(centerX + eyeSpacing + 5, eyeY - 7);
    ctx.stroke();

    // Nose
    ctx.strokeStyle = '#a26938';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX, eyeY);
    ctx.lineTo(centerX - 2, eyeY + 12);
    ctx.lineTo(centerX + 3, eyeY + 12);
    ctx.stroke();

    // Mouth
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (isAlternate) {
        ctx.arc(centerX, eyeY + 22, 7, 0.2, Math.PI - 0.2, false);
    } else {
        ctx.moveTo(centerX - 6, eyeY + 20);
        ctx.lineTo(centerX + 6, eyeY + 20);
    }
    ctx.stroke();

    // Shoulders / Shirt
    ctx.fillStyle = isAlternate ? '#1e3a8a' : '#065f46';
    ctx.beginPath();
    ctx.ellipse(centerX, y + size * 1.25, size * 0.45, size * 0.35, 0, Math.PI, 0);
    ctx.fill();

    ctx.restore();
}

/**
 * Draws an Ashoka Lion Emblem silhouette on canvas
 */
function drawAshokEmblem(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#b45309';
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 1.5;

    // Base pedestal
    ctx.fillRect(-size * 0.35, size * 0.3, size * 0.7, size * 0.15);
    ctx.strokeRect(-size * 0.35, size * 0.3, size * 0.7, size * 0.15);

    // Chakra in pedestal
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(0, size * 0.375, size * 0.05, 0, Math.PI * 2);
    ctx.fill();

    // 3 Lion Pillars
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(-size * 0.18, -size * 0.05, size * 0.14, 0, Math.PI * 2);
    ctx.arc(0, -size * 0.15, size * 0.16, 0, Math.PI * 2);
    ctx.arc(size * 0.18, -size * 0.05, size * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

/**
 * Draws Guilloché micro-pattern lines on canvas background
 */
function drawGuilloche(ctx, width, height, color = 'rgba(217, 119, 6, 0.07)') {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.75;
    for (let i = -width; i < width * 2; i += 18) {
        ctx.beginPath();
        for (let y = 0; y < height; y += 4) {
            const x = i + Math.sin(y / 15) * 12 + Math.cos(y / 25) * 8;
            if (y === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    ctx.restore();
}

/**
 * Generates Sample 1: Clean Authentic Aadhaar Card
 */
export function generateCleanAadhaar() {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 440;
    const ctx = canvas.getContext('2d');

    // Background Card
    ctx.fillStyle = '#fafaf9';
    ctx.fillRect(0, 0, 700, 440);
    ctx.strokeStyle = '#e7e5e4';
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 692, 432);

    // Guilloché Security Pattern
    drawGuilloche(ctx, 700, 440, 'rgba(234, 88, 12, 0.06)');

    // Header Tricolor Ribbon
    const grad = ctx.createLinearGradient(0, 0, 700, 0);
    grad.addColorStop(0, '#ff9933');
    grad.addColorStop(0.5, '#ffffff');
    grad.addColorStop(1, '#138808');
    ctx.fillStyle = grad;
    ctx.fillRect(10, 10, 680, 8);

    // Government Header
    drawAshokEmblem(ctx, 50, 45, 40);

    ctx.fillStyle = '#9a3412';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('भारत सरकार', 85, 36);
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('GOVERNMENT OF INDIA', 85, 52);

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('आधार - आम आदमी का अधिकार', 380, 42);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(15, 68);
    ctx.lineTo(685, 68);
    ctx.stroke();

    // Citizen Photo
    drawFaceAvatar(ctx, 40, 95, 115, false);

    // Text Fields
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('राजेश कुमार शर्मा', 185, 125);
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Rajesh Kumar Sharma', 185, 148);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('जन्म तिथि / DOB: ', 185, 185);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('15/08/1988', 305, 185);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('लिंग / Gender: ', 185, 215);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('पुरुष / MALE', 285, 215);

    // Simulated QR Code Block
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(520, 95, 140, 140);
    ctx.fillStyle = '#ffffff';
    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            if ((r + c) % 2 === 0 || (r * c) % 3 === 0) {
                ctx.fillRect(525 + c * 18, 100 + r * 18, 14, 14);
            }
        }
    }
    // QR position corners
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(530, 105, 30, 30);
    ctx.fillRect(620, 105, 30, 30);
    ctx.fillRect(530, 195, 30, 30);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(536, 111, 18, 18);
    ctx.fillRect(626, 111, 18, 18);
    ctx.fillRect(536, 201, 18, 18);

    // Red separator
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(15, 310, 670, 4);

    // 12-Digit Verhoeff Valid Aadhaar Number: 5432 1987 9019 (Check digit 9 is Verhoeff valid)
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('5432  1987  9019', 350, 365);
    ctx.textAlign = 'left';

    // Specimen Watermark
    ctx.save();
    ctx.translate(350, 220);
    ctx.rotate(-Math.PI / 8);
    ctx.fillStyle = 'rgba(100, 116, 139, 0.18)';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPECIMEN — NOT A REAL ID', 0, 0);
    ctx.restore();

    // Footer
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText('UIDAI Helpline: 1947 | www.uidai.gov.in | Unique Identification Authority of India', 130, 410);

    return canvas.toDataURL('image/jpeg', 0.95);
}

/**
 * Generates Sample 2: Spliced DOB Tampered PAN Card
 * Contains localized splice over the DOB field (1999 pasted over 1985)
 */
export function generateTamperedPAN() {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 440;
    const ctx = canvas.getContext('2d');

    // Background PAN Blue Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 700, 440);
    bgGrad.addColorStop(0, '#e0f2fe');
    bgGrad.addColorStop(0.5, '#bae6fd');
    bgGrad.addColorStop(1, '#7dd3fc');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 700, 440);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 692, 432);

    drawGuilloche(ctx, 700, 440, 'rgba(3, 105, 161, 0.08)');

    // Header
    drawAshokEmblem(ctx, 50, 40, 36);

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('आयकर विभाग', 85, 30);
    ctx.fillText('INCOME TAX DEPARTMENT', 85, 48);

    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('भारत सरकार / GOVT. OF INDIA', 420, 38);

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(15, 60);
    ctx.lineTo(685, 60);
    ctx.stroke();

    // Permanent Account Number
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('Permanent Account Number Card', 200, 85);
    ctx.font = 'bold 24px "Courier New", monospace';
    ctx.fillStyle = '#1e1b4b';
    ctx.fillText('ABCPS1234F', 200, 115);

    // Citizen Photo
    drawFaceAvatar(ctx, 40, 130, 110, false);

    // Text Fields
    ctx.fillStyle = '#334155';
    ctx.font = '12px sans-serif';
    ctx.fillText('नाम / Name', 185, 150);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('RAJESH KUMAR SHARMA', 185, 168);

    ctx.fillStyle = '#334155';
    ctx.font = '12px sans-serif';
    ctx.fillText("पिता का नाम / Father's Name", 185, 200);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('SURESH SHARMA', 185, 218);

    ctx.fillStyle = '#334155';
    ctx.font = '12px sans-serif';
    ctx.fillText('जन्म की तारीख / Date of Birth', 185, 250);

    // TAMPERING: Draw a slightly mismatched white-backed spliced patch over DOB
    // Simulating Photoshop digital splice with sharp compression difference
    ctx.save();
    ctx.fillStyle = '#f8fafc'; // slightly off-white paste
    ctx.fillRect(180, 258, 145, 26);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px "Arial", sans-serif'; // mismatched font
    ctx.fillText('15/08/1999', 186, 277);
    ctx.restore();

    // Hologram Box
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(520, 130, 120, 120);
    ctx.strokeStyle = '#94a3b8';
    ctx.strokeRect(520, 130, 120, 120);
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(580, 190, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('ITD HOLOGRAM', 535, 195);

    // Signature line
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(380, 360);
    ctx.lineTo(620, 360);
    ctx.stroke();
    ctx.font = 'italic 16px cursive';
    ctx.fillText('Rajesh Sharma', 420, 350);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('हस्ताक्षर / Signature', 460, 380);

    // Specimen Watermark
    ctx.save();
    ctx.translate(350, 220);
    ctx.rotate(-Math.PI / 8);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPECIMEN — TAMPERED DOB', 0, 0);
    ctx.restore();

    return canvas.toDataURL('image/jpeg', 0.88);
}

/**
 * Generates Sample 3: WhatsApp Forwarded Degraded ID (Voter ID)
 */
export function generateWhatsAppForwardedID() {
    const canvas = document.createElement('canvas');
    canvas.width = 480; // Compressed resolution
    canvas.height = 310;
    const ctx = canvas.getContext('2d');

    // Muted/noisy background
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 480, 310);

    // Add noise & blurred lines
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('ELECTION COMMISSION OF INDIA', 80, 30);
    ctx.fillText('भारत निर्वाचन आयोग', 80, 48);

    drawAshokEmblem(ctx, 40, 35, 28);

    // EPIC Number
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillText('WBG1234567', 300, 35);

    drawFaceAvatar(ctx, 30, 75, 80, false);

    ctx.font = '12px sans-serif';
    ctx.fillText('Name: RAJESH KUMAR SHARMA', 130, 100);
    ctx.fillText("Father's Name: SURESH SHARMA", 130, 130);
    ctx.fillText('Sex: MALE', 130, 160);
    ctx.fillText('DOB: 15/08/1988', 130, 190);

    // Add JPEG noise artifacts by lowering quality to 0.35 and downscaling
    const lowQual = canvas.toDataURL('image/jpeg', 0.30);
    return lowQual;
}

/**
 * Generates Matching Reference Selfie
 */
export function generateMatchingSelfie() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    // Natural lighting background
    const bgGrad = ctx.createRadialGradient(200, 200, 50, 200, 200, 250);
    bgGrad.addColorStop(0, '#f1f5f9');
    bgGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 400, 400);

    // Draw same person avatar (matching)
    drawFaceAvatar(ctx, 80, 40, 240, false);

    return canvas.toDataURL('image/jpeg', 0.92);
}

/**
 * Generates Non-Matching Impersonator Reference Selfie
 */
export function generateMismatchedSelfie() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createRadialGradient(200, 200, 50, 200, 200, 250);
    bgGrad.addColorStop(0, '#fef2f2');
    bgGrad.addColorStop(1, '#fecaca');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 400, 400);

    // Draw alternate person avatar (different skin tone, hair, features)
    drawFaceAvatar(ctx, 80, 40, 240, true);

    return canvas.toDataURL('image/jpeg', 0.92);
}

/**
 * PramaanAI - Real-Time Error Level Analysis (ELA) & Image Forensics Engine
 * Implements pixel-level JPEG compression artifact disparity analysis,
 * thermal/jet heatmap generation, splicing ROI detection, and WhatsApp re-compression advisory.
 * Compliant with SIH Statement 21688.
 */

/**
 * Applies a Jet/Thermal colormap to a scalar error value (0.0 to 1.0)
 * @param {number} t Normalized value between 0.0 and 1.0
 * @returns {[number, number, number]} [R, G, B] array (0-255)
 */
export function getJetColor(t) {
    t = Math.max(0, Math.min(1, t));
    let r = 0, g = 0, b = 0;
    
    // 4-phase jet/thermal ramp: Blue -> Cyan -> Yellow -> Red -> Magenta
    if (t < 0.125) {
        // Deep navy to blue
        b = Math.floor(128 + t * 8 * 127);
    } else if (t < 0.375) {
        // Blue to Cyan
        const val = (t - 0.125) * 4;
        b = 255;
        g = Math.floor(val * 255);
    } else if (t < 0.625) {
        // Cyan to Yellow
        const val = (t - 0.375) * 4;
        g = 255;
        r = Math.floor(val * 255);
        b = Math.floor(255 * (1 - val));
    } else if (t < 0.875) {
        // Yellow to Red
        const val = (t - 0.625) * 4;
        r = 255;
        g = Math.floor(255 * (1 - val));
    } else {
        // Red to Bright White/Magenta
        const val = (t - 0.875) * 8;
        r = 255;
        g = Math.floor(val * 200);
        b = Math.floor(val * 255);
    }
    return [r, g, b];
}

/**
 * Helper to ensure any input (string DataURL, Blob URL, or Image element) is fully loaded
 */
async function resolveImageSource(src) {
    if (!src) throw new Error('No image source provided for ELA analysis');
    if (src instanceof HTMLCanvasElement) {
        return src;
    }
    if (src instanceof HTMLImageElement && src.complete && (src.naturalWidth || src.width)) {
        return src;
    }
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            if (img.naturalWidth && img.naturalHeight) {
                resolve(img);
            } else {
                reject(new Error('Uploaded image has zero dimensions'));
            }
        };
        img.onerror = () => reject(new Error('Failed to load uploaded image for ELA analysis'));
        img.src = typeof src === 'string' ? src : (src.src || '');
    });
}

/**
 * Performs full Error Level Analysis on an image element, DataURL, or canvas.
 * @param {HTMLImageElement | HTMLCanvasElement | string} rawSource 
 * @param {Object} options Configuration parameters
 * @param {number} [options.quality=0.75] JPEG re-compression quality (0.1 - 1.0)
 * @param {number} [options.amplification=22.0] Difference scale factor
 * @param {number} [options.blockSize=16] Macroblock analysis size in pixels
 * @param {number} [options.tamperThreshold=0.32] Anomaly detection threshold
 * @returns {Promise<{
 *   tamper_score: number,
 *   heatmap_data_url: string,
 *   diff_data_url: string,
 *   compression_warning: boolean,
 *   forensic_notes: string,
 *   suspicious_regions: Array<{x: number, y: number, width: number, height: number, mean_error: number, confidence: number}>,
 *   quant_mean_error: number,
 *   noise_variance: number
 * }>}
 */
export async function runErrorLevelAnalysis(rawSource, options = {}) {
    const sourceImage = await resolveImageSource(rawSource);
    const quality = options.quality !== undefined ? options.quality : 0.75;
    const amplification = options.amplification !== undefined ? options.amplification : 22.0;
    const blockSize = options.blockSize || 16;
    const tamperThreshold = options.tamperThreshold || 0.32;

    const width = sourceImage.naturalWidth || sourceImage.width;
    const height = sourceImage.naturalHeight || sourceImage.height;

    if (!width || !height) {
        throw new Error('Invalid image dimensions for ELA analysis');
    }

    // 1. Create source canvas and extract original RGBA pixel data
    const origCanvas = document.createElement('canvas');
    origCanvas.width = width;
    origCanvas.height = height;
    const origCtx = origCanvas.getContext('2d', { willReadFrequently: true });
    origCtx.drawImage(sourceImage, 0, 0, width, height);
    const origImageData = origCtx.getImageData(0, 0, width, height);
    const origPixels = origImageData.data;

    // 2. Re-compress the image to JPEG at the specified quality level
    const jpegDataUrl = origCanvas.toDataURL('image/jpeg', quality);
    
    // Load the re-compressed JPEG into an image and extract its pixels
    const recompressedImg = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(new Error('Failed to recompress image for ELA: ' + e));
        img.src = jpegDataUrl;
    });

    const recompCanvas = document.createElement('canvas');
    recompCanvas.width = width;
    recompCanvas.height = height;
    const recompCtx = recompCanvas.getContext('2d', { willReadFrequently: true });
    recompCtx.drawImage(recompressedImg, 0, 0, width, height);
    const recompImageData = recompCtx.getImageData(0, 0, width, height);
    const recompPixels = recompImageData.data;

    // 3. Compute absolute difference matrix & macroblock error grids
    const totalPixels = width * height;
    const diffImageData = origCtx.createImageData(width, height);
    const diffPixels = diffImageData.data;

    const heatmapImageData = origCtx.createImageData(width, height);
    const heatmapPixels = heatmapImageData.data;

    let totalError = 0;
    let maxError = 0;
    const pixelErrors = new Float32Array(totalPixels);

    // Single-pass pixel difference computation
    for (let i = 0; i < totalPixels; i++) {
        const offset = i * 4;
        const dr = Math.abs(origPixels[offset] - recompPixels[offset]);
        const dg = Math.abs(origPixels[offset + 1] - recompPixels[offset + 1]);
        const db = Math.abs(origPixels[offset + 2] - recompPixels[offset + 2]);
        
        // Luminance-weighted error: 0.299R + 0.587G + 0.114B
        const err = (dr * 0.299 + dg * 0.587 + db * 0.114);
        pixelErrors[i] = err;
        totalError += err;
        if (err > maxError) maxError = err;

        // Amplified grayscale difference
        const ampVal = Math.min(255, Math.floor(err * amplification));
        diffPixels[offset] = ampVal;
        diffPixels[offset + 1] = ampVal;
        diffPixels[offset + 2] = ampVal;
        diffPixels[offset + 3] = 255;
    }

    const meanError = totalError / totalPixels;

    // Compute standard deviation
    let sumSqDiff = 0;
    for (let i = 0; i < totalPixels; i++) {
        const diff = pixelErrors[i] - meanError;
        sumSqDiff += diff * diff;
    }
    const stdDev = Math.sqrt(sumSqDiff / totalPixels);

    // 4. Macroblock analysis (e.g., 16x16 macroblock grid)
    const blocksX = Math.ceil(width / blockSize);
    const blocksY = Math.ceil(height / blockSize);
    const blockErrorGrid = new Float32Array(blocksX * blocksY);
    const suspiciousBlocks = [];

    const anomalyCutoff = meanError + Math.max(8.0, stdDev * 2.2);

    for (let by = 0; by < blocksY; by++) {
        for (let bx = 0; bx < blocksX; bx++) {
            const startX = bx * blockSize;
            const startY = by * blockSize;
            const endX = Math.min(width, startX + blockSize);
            const endY = Math.min(height, startY + blockSize);

            let blockErrSum = 0;
            let blockPixelCount = 0;

            for (let y = startY; y < endY; y++) {
                const rowOffset = y * width;
                for (let x = startX; x < endX; x++) {
                    blockErrSum += pixelErrors[rowOffset + x];
                    blockPixelCount++;
                }
            }

            const blockMean = blockPixelCount > 0 ? (blockErrSum / blockPixelCount) : 0;
            blockErrorGrid[by * blocksX + bx] = blockMean;

            if (blockMean > anomalyCutoff && blockMean > 12.0) {
                suspiciousBlocks.push({
                    bx,
                    by,
                    x: startX,
                    y: startY,
                    width: endX - startX,
                    height: endY - startY,
                    mean_error: blockMean,
                    anomalyDelta: blockMean - meanError
                });
            }
        }
    }

    // 5. Cluster adjacent suspicious blocks into coherent ROI bounding boxes
    const suspiciousRegions = clusterSuspiciousBlocks(suspiciousBlocks, blockSize, width, height, meanError);

    // 6. Generate smooth Thermal/Jet Heatmap
    for (let y = 0; y < height; y++) {
        const by = Math.min(blocksY - 1, Math.floor(y / blockSize));
        const rowOffset = y * width;
        for (let x = 0; x < width; x++) {
            const bx = Math.min(blocksX - 1, Math.floor(x / blockSize));
            const pixelErr = pixelErrors[rowOffset + x];
            const blockErr = blockErrorGrid[by * blocksX + bx];

            // Blend pixel-level high-frequency error with macroblock spatial error
            const blendedErr = (pixelErr * 0.4 + blockErr * 0.6);
            const normVal = Math.min(1.0, blendedErr / Math.max(25.0, meanError * 3.5));

            const [r, g, b] = getJetColor(normVal);
            const offset = (rowOffset + x) * 4;
            heatmapPixels[offset] = r;
            heatmapPixels[offset + 1] = g;
            heatmapPixels[offset + 2] = b;
            // Adaptive alpha: Transparent in uniform low-error areas, opaque in high-error hotspots
            heatmapPixels[offset + 3] = Math.min(255, Math.floor(40 + normVal * 215));
        }
    }

    // Put heatmap image data on canvas
    const heatmapCanvas = document.createElement('canvas');
    heatmapCanvas.width = width;
    heatmapCanvas.height = height;
    const heatmapCtx = heatmapCanvas.getContext('2d');
    heatmapCtx.putImageData(heatmapImageData, 0, 0);

    // Put diff image data on canvas
    const diffCanvas = document.createElement('canvas');
    diffCanvas.width = width;
    diffCanvas.height = height;
    const diffCtx = diffCanvas.getContext('2d');
    diffCtx.putImageData(diffImageData, 0, 0);

    // 7. Determine overall Tamper Score (0.0 to 1.0)
    // Tamper score scales with anomaly magnitude and cluster count
    let anomalyScoreSum = 0;
    suspiciousRegions.forEach(region => {
        anomalyScoreSum += region.confidence * Math.min(1.0, (region.width * region.height) / (width * height * 0.08));
    });

    const normalizedTamperScore = Math.min(1.0, Math.max(0.0,
        (suspiciousRegions.length > 0 ? 0.35 : 0.0) +
        (anomalyScoreSum * 0.45) +
        (stdDev > 9.0 ? 0.20 : 0.0)
    ));

    // 8. WhatsApp / Multi-generation recompression warning detection
    // Forwarded images show severe high-frequency attenuation and very low mean quantization error variance
    const isVeryLowMean = (meanError < 1.8 && stdDev < 1.2);
    const isVeryHighUniformError = (meanError > 18.0 && stdDev < 4.0);
    const compressionWarning = isVeryLowMean || isVeryHighUniformError || (width < 600 && quality < 0.7);

    let forensicNotes = 'Standard single-generation JPEG error profile. Error levels are uniform across all text & photo zones.';
    if (suspiciousRegions.length > 0) {
        forensicNotes = `Detected ${suspiciousRegions.length} localized ELA anomalous region(s). Discontinuous compression quantization indicates potential digital splicing or text alteration.`;
    } else if (compressionWarning) {
        forensicNotes = 'Noticeable compression artifacts or social media (WhatsApp/Telegram) multi-generation re-save detected. Tamper signals are contextualized accordingly.';
    }

    return {
        tamper_score: parseFloat(normalizedTamperScore.toFixed(3)),
        heatmap_data_url: heatmapCanvas.toDataURL('image/png'),
        diff_data_url: diffCanvas.toDataURL('image/png'),
        compression_warning: compressionWarning,
        forensic_notes: forensicNotes,
        suspicious_regions: suspiciousRegions,
        quant_mean_error: parseFloat(meanError.toFixed(2)),
        noise_variance: parseFloat((stdDev * stdDev).toFixed(2))
    };
}

/**
 * Helper to cluster adjacent anomalous macroblocks into rectangular bounding boxes
 */
function clusterSuspiciousBlocks(blocks, blockSize, imgWidth, imgHeight, baseMean) {
    if (!blocks || blocks.length === 0) return [];

    const clusters = [];
    const visited = new Set();

    for (let i = 0; i < blocks.length; i++) {
        if (visited.has(i)) continue;

        const currentCluster = [blocks[i]];
        visited.add(i);

        // Flood fill search for neighboring blocks within 2 blocks distance
        for (let j = 0; j < currentCluster.length; j++) {
            const b1 = currentCluster[j];
            for (let k = 0; k < blocks.length; k++) {
                if (visited.has(k)) continue;
                const b2 = blocks[k];
                const dx = Math.abs(b1.bx - b2.bx);
                const dy = Math.abs(b1.by - b2.by);
                if (dx <= 2 && dy <= 2) {
                    visited.add(k);
                    currentCluster.push(b2);
                }
            }
        }

        // Only keep clusters with at least 2 connected blocks or 1 high-intensity anomaly
        if (currentCluster.length >= 2 || currentCluster[0].anomalyDelta > 15.0) {
            let minX = imgWidth, minY = imgHeight, maxX = 0, maxY = 0;
            let clusterErrSum = 0;

            currentCluster.forEach(b => {
                minX = Math.min(minX, b.x);
                minY = Math.min(minY, b.y);
                maxX = Math.max(maxX, b.x + b.width);
                maxY = Math.max(maxY, b.y + b.height);
                clusterErrSum += b.mean_error;
            });

            // Add padding around cluster for better visual highlight
            const pad = 6;
            const rx = Math.max(0, minX - pad);
            const ry = Math.max(0, minY - pad);
            const rw = Math.min(imgWidth - rx, (maxX - minX) + pad * 2);
            const rh = Math.min(imgHeight - ry, (maxY - minY) + pad * 2);
            const avgErr = clusterErrSum / currentCluster.length;
            const confidence = Math.min(0.99, Math.max(0.40, (avgErr - baseMean) / 25.0));

            clusters.push({
                x: rx,
                y: ry,
                width: rw,
                height: rh,
                mean_error: parseFloat(avgErr.toFixed(2)),
                confidence: parseFloat(confidence.toFixed(2))
            });
        }
    }

    return clusters.slice(0, 6); // Return top 6 most prominent regions
}

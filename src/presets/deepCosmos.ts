export const DEEP_COSMOS_SHADER = `
  vec3 renderDeepCosmos(vec2 p, float t, vec3 c1, vec3 c2, vec3 c3, float complexity, float intensity, float cloudScale, float starDensity) {
    vec3 col = c1;

    vec2 q = p * (0.5 + cloudScale);
    float time = t * (0.08 + complexity * 0.12);

    float f = 0.0;
    float scale = 1.0;
    float weight = 0.5;
    vec2 warp = vec2(0.0);

    for(int i=0; i<6; i++) {
        warp = vec2(
            snoise(q * scale + vec2(time * 0.5) + warp * 0.8),
            snoise(q * scale - vec2(time * 0.4) - warp * 0.8)
        );

        f += weight * snoise(q * scale + warp * 0.7);
        scale *= 2.1;
        weight *= 0.55;
    }

    f = f * 0.5 + 0.5;

    float densityBase = smoothstep(0.15, 0.85, f);
    float densityPeak = smoothstep(0.5, 1.0, f) * 0.8;

    vec3 nebulaBase = mix(c1, c2, densityBase * (0.6 + complexity * 0.4));
    vec3 nebula = mix(nebulaBase, c3, densityPeak);

    float dust = snoise(q * 5.0 + time * 0.25);
    float dustMask = 1.0 - smoothstep(0.3, 0.75, dust) * (0.5 + intensity * 0.3);
    nebula *= dustMask;

    col = mix(col, nebula, densityBase * intensity * (0.7 + complexity * 0.3));

    float starRand1 = hash(p * (180.0 + starDensity * 100.0));
    float stars1 = step(1.0 - (0.0002 + starDensity * 0.0004), starRand1);
    float twinkle1 = sin(t * (2.5 + starDensity) + starRand1 * 30.0);
    stars1 *= (0.5 + 0.5 * twinkle1);

    float starRand2 = hash(p * (320.0 + starDensity * 150.0) + 11.0);
    float stars2 = step(1.0 - (0.0003 + starDensity * 0.0006), starRand2);
    float twinkle2 = sin(t * (3.5 + starDensity * 1.5) + starRand2 * 50.0) * 0.5 + 0.5;
    stars2 *= (0.4 + 0.3 * twinkle2);

    float starRand3 = hash(p * (500.0 + starDensity * 200.0) + 23.0);
    float stars3 = step(1.0 - (0.0005 + starDensity * 0.0008), starRand3);
    float stars3tw = sin(t * 4.0 + starRand3 * 70.0);
    stars3 *= (0.3 + 0.4 * (stars3tw * 0.5 + 0.5));

    float totalStars = stars1 + stars2 + stars3;

    vec3 starCol = mix(vec3(1.0, 1.0, 0.95), c3, hash(p + 7.0) * 0.4);
    col += starCol * totalStars * intensity;

    float brightStarThreshold = 0.99995 - starDensity * 0.0001;
    float brightStar = step(brightStarThreshold, starRand1);
    if(brightStar > 0.0) {
        vec2 starPos = fract(p * (180.0 + starDensity * 100.0)) - 0.5;
        float flare = 0.0015 / (length(starPos) + 0.001);
        float flare2 = 0.0008 / (length(starPos * 2.0 + vec2(0.1)) + 0.001);
        col += c3 * (flare + flare2) * 2.5 * intensity;
    }

    col = pow(col, vec3(0.9));
    col *= 1.0 + intensity * 0.2;

    return clamp(col, 0.0, 1.0);
  }
`;

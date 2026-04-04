export const WINDOWS_BLOOM_SHADER = `
  vec3 renderWindowsBloom(vec2 p, float t, vec3 c1, vec3 c2, vec3 c3, float complexity, float intensity, float ribbonDensity, float curlAmount) {
    vec3 col = mix(c1, c1 * 0.9 + 0.1, p.y * 0.5 + 0.5);

    float time = t * 0.2;

    int layers = int(ribbonDensity * 5.0) + 3;

    for(int i = 0; i < 8; i++) {
        if(i >= layers) break;
        float fi = float(i);
        float normIndex = fi / float(layers);

        vec2 uv = p;
        uv.x += time * 0.1 * (1.0 + normIndex);

        float wave1 = sin(uv.x * (1.0 + normIndex * 0.5) + time + fi * 2.0);
        float wave2 = cos(uv.x * (2.5 + curlAmount) - time * 0.5 + fi);
        float wave3 = sin(uv.x * 0.5 + time * 0.2);

        float centerY = (wave1 * 0.5 + wave2 * 0.2 + wave3 * 0.3) * 0.6;

        float verticalOffset = (normIndex - 0.5) * 1.5;
        float ribbonY = uv.y - centerY - verticalOffset;

        float width = 0.35 + sin(uv.x * 2.0 + fi) * 0.1;
        width *= (1.0 + complexity * 0.5);

        float edgeSoftness = 0.005;
        float dist = abs(ribbonY) - width;
        float ribbonMask = smoothstep(edgeSoftness, -edgeSoftness, dist);

        if(ribbonMask > 0.001) {
            float slope = cos(uv.x * (1.0 + normIndex * 0.5) + time + fi * 2.0) * (0.5 + normIndex * 0.25)
                        - sin(uv.x * (2.5 + curlAmount) - time * 0.5 + fi) * (2.5 + curlAmount) * 0.2;

            vec3 normal = normalize(vec3(-slope, 1.0, 0.5));
            vec3 lightDir = normalize(vec3(0.5, 0.8, 0.5));

            float diff = max(0.0, dot(normal, lightDir));
            diff = pow(diff, 1.5);

            vec3 viewDir = vec3(0.0, 0.0, 1.0);
            vec3 halfVec = normalize(lightDir + viewDir);
            float spec = pow(max(0.0, dot(normal, halfVec)), 32.0);

            float colorPhase = uv.x * 0.2 + normIndex * 2.0;
            vec3 colA = mix(c2, c3, 0.5 + 0.5 * sin(colorPhase));
            vec3 colB = mix(c3, c1, 0.5 + 0.5 * cos(colorPhase * 0.7));

            float vGrad = smoothstep(-width, width, ribbonY);
            vec3 ribbonBase = mix(colA, colB, vGrad);

            vec3 finalRibbon = ribbonBase * (0.6 + diff * 0.6);
            finalRibbon += vec3(1.0) * spec * 0.4 * intensity;

            float rim = smoothstep(width - 0.02, width, abs(ribbonY));
            finalRibbon += c3 * rim * 0.5;

            col *= 1.0 - (ribbonMask * 0.3);

            float alpha = 0.95 + 0.05 * sin(uv.x * 10.0);
            col = mix(col, finalRibbon, ribbonMask * alpha);
        }
    }

    float grain = snoise(p * 200.0 + t) * 0.02;
    col += grain;

    return clamp(col, 0.0, 1.0);
  }
`;

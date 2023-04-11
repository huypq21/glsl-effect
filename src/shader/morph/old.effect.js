const oldEffect = `
float2 oldHash(float2 p)
{
    float3 p3 = frac(float3(p.xyx) * float3(166.1031, 147.1030, 142.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return frac((p3.xx + p3.yz) * p3.zy);
}

float oldSimplexNoise(float2 uv)
{
    const float k1 = 0.366025f;
    const float k2 = 0.211324f;

    int2 idx = floor(uv + (uv.x + uv.y) * k1);
    float2 a = uv - (float2(idx) - float(idx.x + idx.y) * k2);
    int2 tb = a.y > a.x ? int2(0, 1) : int2(1, 0);
    float2 b = a - tb + k2;
    float2 c = a - 1.f + k2 * 2.f;
    
    float3 kernel = max(0.5f - float3(dot(a, a), dot(b, b), dot(c, c)), 0.f);
    float3 noise = kernel * kernel * kernel * kernel * 
    float3(dot(a, oldHash(idx)*2.f-1.), 
           dot(b, oldHash(idx + tb)*2.-1.), 
           dot(c, oldHash(idx + 1.f)*2.-1.));
    
    return dot(float3(70.f), noise);
}


float oldVerticalLine(float2 uv, float time)
{
    float uvX = uv.x + time*0.0000003;
    float2 xHash = oldHash(float2(uvX,uvX));
    float vertical = step(0.9999993,sin(uvX*1000.0 * (xHash.x*0.01+0.01)));
    
    float uvY = uv.y + time*0.000001;
    float2 yHash = oldHash(float2(uvY,uvY));
    vertical *= sin(uvY*1000.0 * (yHash.x));
    
    
    return clamp(1.0 - vertical,0.,1.);
}

vec4 oldEffect(){
  vec2 uv = vUv;
  float t = iTime;
  
  float3 col = float3(0.0,0.0,0.0);
  col += oldVerticalLine(uv,t)*0.5;
  col += (1.0 - oldVerticalLine(uv-3.0,t*5.0))*0.5;
  col *= smoothstep(0.9,0.83, oldSimplexNoise((uv + oldHash(float2(t,t))*154.4541-154.4541)*10.0));
  col *= clamp(1.f - oldHash(uv + t * 0.01f).x * 0.25,0.,1.);
  col *= smoothstep(1.4,0.0, length(uv-0.5));
  
  return vec4(col*texture(iChannel0,uv).rgb,1.0);
}
`;

export default oldEffect;

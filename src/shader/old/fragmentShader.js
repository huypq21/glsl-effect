const fragmentShader = `
uniform vec3      iResolution;
uniform float     iTime;                 // shader playback time (in seconds)
uniform float     iTimeDelta;            // render time (in seconds)
uniform float     iFrameRate;            // shader frame rate
uniform int       iFrame;                // shader playback frame
uniform float     iChannelTime[4];       // channel playback time (in seconds)
uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
uniform sampler2D iChannel0;          // input channel. XX = 2D/Cube
uniform sampler2D iChannel1;   
uniform vec4      iDate;  
uniform int showEffect;
varying vec2 vUv;

#define int2 vec2
#define float2 vec2
#define int3 vec3
#define float3 vec3
#define int4 vec4
#define float4 vec4
#define frac fract
#define float2x2 mat2
#define float3x3 mat3
#define float4x4 mat4
#define lerp mix
#define CurrentTime (iTime)
#define sincos(x,s,c) s = sin(x),c = cos(x)
#define mul(x,y) (x*y)
#define atan2 atan
#define fmod mod
#define static

float2 hash(float2 p)
{
    float3 p3 = frac(float3(p.xyx) * float3(166.1031, 147.1030, 142.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return frac((p3.xx + p3.yz) * p3.zy);
}

float simplexNoise(float2 uv)
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
    float3(dot(a, hash(idx)*2.f-1.), 
           dot(b, hash(idx + tb)*2.-1.), 
           dot(c, hash(idx + 1.f)*2.-1.));
    
    return dot(float3(70.f), noise);
}


float verticalLine(float2 uv, float time)
{
    float uvX = uv.x + time*0.0000003;
    float2 xHash = hash(float2(uvX,uvX));
    float vertical = step(0.9999993,sin(uvX*1000.0 * (xHash.x*0.01+0.01)));
    
    float uvY = uv.y + time*0.000001;
    float2 yHash = hash(float2(uvY,uvY));
    vertical *= sin(uvY*1000.0 * (yHash.x));
    
    
    return clamp(1.0 - vertical,0.,1.);
}

void main()  {
    vec2 uv = vUv;
    float t = iTime;
    
    float3 col = float3(0.0,0.0,0.0);
    col += verticalLine(uv,t)*0.5;
    col += (1.0 - verticalLine(uv-3.0,t*5.0))*0.5;
    col *= smoothstep(0.9,0.83, simplexNoise((uv + hash(float2(t,t))*154.4541-154.4541)*10.0));
    col *= clamp(1.f - hash(uv + t * 0.01f).x * 0.25,0.,1.);
    col *= smoothstep(1.4,0.0, length(uv-0.5));
    
    gl_FragColor = vec4(col*texture(iChannel0,uv).rgb,1.0);
}
`;

export default fragmentShader;

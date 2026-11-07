# Usage: python3 sfx.py OUT.wav DURATION "pop_times_csv" "whoosh_times_csv"
import sys, numpy as np, wave
out, D = sys.argv[1], float(sys.argv[2])
pops = [float(t) for t in sys.argv[3].split(',') if t]
whs = [float(t) for t in sys.argv[4].split(',') if t]
sr = 44100; x = np.zeros(int(sr*D)); rng = np.random.default_rng(1)
def add(t, s):
    i = int(max(0, t)*sr); n = min(len(s), len(x)-i)
    if n > 0: x[i:i+n] += s[:n]
def pop(f=900, dur=.09, v=.25):
    t = np.arange(int(sr*dur))/sr; fr = f*np.exp(-t*18)+f*.4
    return v*np.sin(2*np.pi*np.cumsum(fr)/sr)*np.exp(-t*40)
def whoosh(dur=.45, v=.18):
    n = int(sr*dur); w = rng.standard_normal(n); o = np.zeros(n); y = 0
    for k in range(n):
        a = 0.02+0.25*np.sin(np.pi*k/n); y += a*(w[k]-y); o[k] = y
    return v*o*np.sin(np.pi*np.arange(n)/n)
for t in whs: add(t-0.15, whoosh())
for t in pops: add(t, pop())
x /= max(1, np.abs(x).max()/0.8)
with wave.open(out, 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(np.int16(x*32767).tobytes())

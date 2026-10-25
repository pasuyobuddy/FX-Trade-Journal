# Draws the app icon (crimson tile, white/teal candlesticks) into the Android mipmap folders.
from PIL import Image, ImageDraw
import os, sys
root = os.path.join(os.path.dirname(__file__), '..', 'android', 'app', 'src', 'main', 'res')
RED=(225,38,74); TEAL=(23,171,204); WHITE=(255,255,255)
def candles(d, box, scale):
    x0,y0,x1,y1 = box; w=x1-x0; h=y1-y0
    bars=[(0.12,0.55,0.80,0.62,0.74,WHITE),(0.34,0.40,0.72,0.47,0.62,WHITE),(0.56,0.28,0.60,0.36,0.52,TEAL),(0.78,0.12,0.46,0.20,0.38,WHITE)]
    bw=w*0.14
    for cx,top,bot,btop,bbot,col in bars:
        X=x0+cx*w+bw/2
        d.line([(X,y0+top*h),(X,y0+bot*h)],fill=col,width=max(2,int(w*0.025)))
        d.rounded_rectangle([X-bw/2,y0+btop*h,X+bw/2,y0+bbot*h],radius=max(1,int(bw*0.18)),fill=col)
    d.line([(x0+0.08*w,y0+0.90*h),(x0+0.95*w,y0+0.90*h)],fill=WHITE,width=max(2,int(w*0.03)))
def full(n, round_=False):
    S=n*4; im=Image.new('RGBA',(S,S),(0,0,0,0)); d=ImageDraw.Draw(im)
    if round_: d.ellipse([0,0,S-1,S-1],fill=RED)
    else: d.rounded_rectangle([0,0,S-1,S-1],radius=int(S*0.18),fill=RED)
    candles(d,(S*0.2,S*0.2,S*0.8,S*0.8),S)
    return im.resize((n,n),Image.LANCZOS)
def fg(n):
    S=n*4; im=Image.new('RGBA',(S,S),(0,0,0,0)); d=ImageDraw.Draw(im)
    candles(d,(S*0.30,S*0.30,S*0.70,S*0.70),S)   # inside the adaptive-icon safe zone
    return im.resize((n,n),Image.LANCZOS)
for name,n,f in [('mdpi',48,108),('hdpi',72,162),('xhdpi',96,216),('xxhdpi',144,324),('xxxhdpi',192,432)]:
    p=os.path.join(root,'mipmap-'+name)
    full(n).save(os.path.join(p,'ic_launcher.png')); full(n,True).save(os.path.join(p,'ic_launcher_round.png')); fg(f).save(os.path.join(p,'ic_launcher_foreground.png'))
open(os.path.join(root,'values','ic_launcher_background.xml'),'w').write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#E1264A</color>\n</resources>\n')
# 512px Play Store icon
out=os.path.join(os.path.dirname(__file__),'..','store'); os.makedirs(out,exist_ok=True)
im=Image.new('RGB',(512,512),RED); d=ImageDraw.Draw(im); candles(d,(512*0.2,512*0.2,512*0.8,512*0.8),512); im.save(os.path.join(out,'play-icon-512.png'))
print('icons written')

import time
import webbrowser
n=1
print("This program started here"+time.ctime())
while(n<5):
    time.sleep(10)
    webbrowser.open("https://www.youtube.com/watch?v=mWUMzCpgtl8")
    n=n+1
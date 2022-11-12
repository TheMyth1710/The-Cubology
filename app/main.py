from tkinter import *
import tkinter.font as font
from PIL import ImageTk, Image
from webbrowser import open as wbopen

# Initialize
root = Tk()
root.title("The Cubology")

# colors
darkblue = "#181D32"
blue = "#252E51"
darkaqua = "#0D6EFD"
aqua = "#0ea5e8"
cream = "#F0E9D2"

width= root.winfo_screenwidth()
height= root.winfo_screenheight()
root.configure(bg=darkblue)
root.geometry(f"{int(width/1.5)}x{int(height/1.5)}")
root.overrideredirect(True)

# Assets
max = ImageTk.PhotoImage(Image.open("app/assets/maximize.png"))
min = ImageTk.PhotoImage(Image.open("app/assets/minimize.png"))
restore = ImageTk.PhotoImage(Image.open("app/assets/restore.png"))
close = ImageTk.PhotoImage(Image.open("app/assets/close.png"))
logo = ImageTk.PhotoImage(Image.open("app/assets/logo.png").resize((30, 30), Image.Resampling.LANCZOS))

# Custom Functions

def center(win):
    win.update_idletasks()
    w = win.winfo_width()
    frm_width = win.winfo_rootx() - win.winfo_x()
    win_width = w + 2 * frm_width
    h = win.winfo_height()
    titlebar_height = win.winfo_rooty() - win.winfo_y()
    win_height = h + titlebar_height + frm_width
    x = win.winfo_screenwidth() // 2 - win_width // 2
    y = win.winfo_screenheight() // 2 - win_height // 2
    win.geometry(f'{w}x{h}+{x}+{y}')
    win.deiconify()

class FloatingWindow(Toplevel):
    def __init__(self, input):
        input.bind("<ButtonPress-1>", self.start_move)
        input.bind("<ButtonRelease-1>", self.stop_move)
        input.bind("<B1-Motion>", self.do_move)

    def start_move(self, event):
        self.x = event.x
        self.y = event.y

    def stop_move(self, event):
        self.x = None
        self.y = None

    def do_move(self, event):
        deltax = event.x - self.x
        deltay = event.y - self.y
        x = root.winfo_x() + deltax
        y = root.winfo_y() + deltay
        root.geometry(f"+{x}+{y}")

def maximize_func(e):
    if (maximize_label["image"] == "pyimage1"): maximize_label["image"] = restore; root.geometry(f"{width}x{height}+0+0")
    else: maximize_label["image"] = max; root.geometry(f"{int(width/1.5)}x{int(height/1.5)}"); center(root)
def minimize_func(e):
    root.state("withdrawn")
    root.overrideredirect(False)
    root.state('iconic')
    root.iconify()
def frameMapped(e):
    root.overrideredirect(True)

class Hover():
    def __init__(self, widget, start, end, parent=None):
        self.widget = widget
        self.start = start
        self.end = end
        self.parent = parent
        self.widget.bind("<Enter>", self.hoverStart)
        self.widget.bind("<Leave>", self.hoverEnd)

    def hoverStart(self, e):
        self.widget.config(background=self.start)
        if self.parent: self.parent.config(background=self.start)
        
    def hoverEnd(self, e):
        self.widget.config(background=self.end)
        if self.parent: self.parent.config(background=self.end)

def underline_font(label):
    f = font.Font(label,label.cget("font"))
    f.configure(underline = True)
    label.configure(font=f)

def submit(e): # The Scramble Function
    accepted_moves = ['U', "U'", 'U2', 'D', "D'", 'D2', 'R', "R'", 'R2', 'L', "L'", 'L2', 'F', "F'", 'F2', 'B', "B'", 'B2']
    scramble = scramble_input.get()
    for splitter in [', ', ',', ' ']:
        if isinstance(scramble, list) and len(scramble) > 1: break
        scramble = ''.join(scramble).split(splitter)
    for move in scramble:
        if move not in accepted_moves:
            error_label.configure(text="Please enter valid moves!")
            break

title_bar = Frame(root, bg="#101426", relief="raised", bd=0)
title_bar.pack(side=TOP, fill=X)
FloatingWindow(title_bar)


title_logo = Label(title_bar, image=logo, font=("Inconsolata"), bg="#101426",  bd=0)
title_logo.pack(side=LEFT, padx=10, pady=4)
title_logo.bind("<Button-1>", func=lambda e: wbopen("https://themyth1710.github.io/The-Cubology/index"))

title_label = Label(title_bar, text="The Cubology", font=("Inconsolata"), bg="#101426", fg=cream)
title_label.pack(side=LEFT, padx=1, pady=4)
FloatingWindow(title_label)

close_label = Label(title_bar, image=close, font=("Inconsolata"), bg="#101426", fg=cream, relief="sunken", bd=0, width=40, height=37.5)
Hover(close_label, "#d90707", "#101426")
close_label.bind("<Button-1>", func=lambda e: root.quit())
close_label.pack(side=RIGHT)
maximize_label = Label(title_bar, image=max, font=("Inconsolata"), bg="#101426", fg=cream, relief="sunken", bd=0, width=40, height=37.5)
Hover(maximize_label, blue, "#101426")
maximize_label.bind("<Button-1>", maximize_func)
maximize_label.pack(side=RIGHT)
minimize_label = Label(title_bar, image=min, font=("Inconsolata"), bg="#101426", fg=cream, relief="sunken", bd=0, width=40, height=37.5)
Hover(minimize_label, blue, "#101426")
minimize_label.bind("<Button-1>", minimize_func)
minimize_label.pack(side=RIGHT)
main = Frame(root, bg=darkblue, bd=0)
main.pack(side=TOP)

main_label = Label(main, text="Enter Scramble Here:", font=("Inconsolata 18 bold"), bg=darkblue, fg=cream, bd=0)
border = Frame(main, background=cream)
padding = Frame(border, background=darkblue)
scramble_input = Entry(padding, font=("Inconsolata 12"), bg=darkblue, fg=cream, bd=0, insertbackground=cream, width=40)
error_label = Label(main, text="", font=("Inconsolata 9 italic"), bg=darkblue, fg='#f66364', width=53, anchor='w')
scramble_input.bind("<Button-1>", func=lambda e: error_label.configure(text=""))

small_label = Label(main, text="Learn Cube Notations", font=("Inconsolata 9"), bg=darkblue, fg=aqua, relief="sunken", bd=0)
small_label.bind("<Button-1>", func=lambda e: wbopen("http://themyth1710.github.io/The-Cubology/learn3x3#cube-notations?click=true"))
underline_font(small_label)

padding_1 = Frame(main, background=aqua)
submit_btn = Label(padding_1, text="Lets Go!", font=("Inconsolata 14"), bg=aqua, fg=darkblue, relief="sunken", bd=0)
Hover(padding_1, darkaqua, aqua, submit_btn)
submit_btn.bind("<Button-1>", submit)

main_label.pack(side=TOP, pady=(50,5))
border.pack(side=TOP, pady=(15,0))
padding.pack(side=TOP, pady=1, padx=1)
scramble_input.pack(side=TOP, padx=5, pady=5)
error_label.pack(side=TOP)
small_label.pack(side=TOP, pady=5)
padding_1.pack(side=TOP, pady=10)
submit_btn.pack(side=TOP, padx=7.5, pady=7.5)

center(root)
root.bind("<Map>", func=lambda e: root.overrideredirect(True))
root.mainloop()
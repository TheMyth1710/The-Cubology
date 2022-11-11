from tkinter import *
from PIL import ImageTk, Image
root = Tk()
root.title("The Cubology")

# colors
blue = "#181D32"
cream = "#F0E9D2"

width= root.winfo_screenwidth()
height= root.winfo_screenheight()
root.configure(bg=blue)
root.geometry(f"{int(width/1.5)}x{int(height/1.5)}")

root.overrideredirect(True)

# Assets
max = ImageTk.PhotoImage(Image.open("app/assets/maximize.png"))
min = ImageTk.PhotoImage(Image.open("app/assets/minimize.png"))
restore = ImageTk.PhotoImage(Image.open("app/assets/restore.png"))
close = ImageTk.PhotoImage(Image.open("app/assets/close.png"))
def center(win):
    """
    centers a tkinter window
    :param win: the main window or Toplevel window to center
    """
    win.update_idletasks()
    width = win.winfo_width()
    frm_width = win.winfo_rootx() - win.winfo_x()
    win_width = width + 2 * frm_width
    height = win.winfo_height()
    titlebar_height = win.winfo_rooty() - win.winfo_y()
    win_height = height + titlebar_height + frm_width
    x = win.winfo_screenwidth() // 2 - win_width // 2
    y = win.winfo_screenheight() // 2 - win_height // 2
    win.geometry('{}x{}+{}+{}'.format(width, height, x, y))
    win.deiconify()
def move_app(e):
    root.geometry(f"+{e.x_root}+{e.y_root}")

def quitter(e):
    root.quit()
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
    if (maximize_label["image"] == "pyimage1"): maximize_label["image"] = restore; root.geometry(f"{int(width/1.5)}x{int(height/1.5)}")
    else: maximize_label["image"] = max; root.geometry("1000x1000")

title_bar = Frame(root, bg="#101426", relief="raised", bd=0)
title_bar.pack(side=TOP, fill=X)
FloatingWindow(title_bar)

title_label = Label(title_bar, text="The Cubology", font=("Inconsolata"), bg="#101426", fg=cream)
title_label.pack(side=LEFT, padx=10, pady=4)
FloatingWindow(title_label)

close_label = Label(title_bar, image=close, font=("Inconsolata"), bg="#101426", fg=cream, relief="sunken", bd=0)
close_label.bind("<Button-1>", quitter)
close_label.pack(side=RIGHT,padx=10,pady=4)
maximize_label = Label(title_bar, image=max, font=("Inconsolata"), bg="#101426", fg=cream, relief="sunken", bd=0)
maximize_label.bind("<Button-1>", maximize_func)
maximize_label.pack(side=RIGHT,padx=10,pady=4)

center(root)
root.mainloop()
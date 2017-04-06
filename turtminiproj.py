import turtle

window=turtle.Screen()
window.bgcolor("blue")

def draw_initial():

    draw_p()
    
    window.exitonclick()



def draw_p():
    pencil=turtle.Turtle()
    pencil.shape("arrow")
    pencil.color("#EE82EE")
    pencil.speed(30)
    pencil.dot(20,"yellow")
    pencil.forward(150)
    pencil.right(90)
    pencil.circle(80)
    pencil.home()
    ang=0
    for i in range(1,37):
        pencil.seth(ang)
        pencil.forward(150)
        pencil.right(90)
        pencil.circle(80)
        pencil.home()
        ang=ang+10
    
    """pencil.color("red")
    pencil.shape("turtle")
    cic_ang=10
    for i in range(1,7):
        pencil.circle(cic_ang)
        cic_ang=cic_ang+10
    pencil.seth(270)
    pencil.color("green")
    pencil.shape("turtle")
    cic_ang=10
    for i in range(1,7):
        pencil.circle(cic_ang)
        cic_ang=cic_ang+10"""
    pencil.forward(150)
    pencil.left(90)
    pencil.color("red")
    pencil.shape("turtle")
    cic_ang=140
    for i in range(1,14):
        pencil.circle(cic_ang)
        cic_ang=cic_ang-10

draw_initial()
  
import turtle	

window=turtle.Screen()
window.bgcolor("yellow")


def draw_square():

	

	prashant=turtle.Turtle()
	prashant.shape("arrow")
	prashant.color("black")
	prashant.speed(1.5)
	prashant.tilt(45)
	prashant.fillcolor("#ffffff")
	d=0
	while(d<4):
		
		prashant.forward(100)
		prashant.left(90)
		d=d+1
		

def draw_circle():
	sam=turtle.Turtle()
	sam.shape("circle")
	sam.color("red")
	sam.speed(1.5)
	sam.circle(100)


def draw_triangle():
	hopeless=turtle.Turtle()
	hopeless.shape("square")
	hopeless.color("red")
	hopeless.speed(1.5)
	p=0
	while(p<3):
		hopeless.forward(100)
		hopeless.left(120)	
		p=p+1
	window.exitonclick()  


draw_square()
draw_circle()
draw_triangle()
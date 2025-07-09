build:
	docker build -t baleinegris-blog:latest .
run:
	docker run -d -p 127.0.0.1:8080:81 --name blog baleinegris-blog
build:
	docker build -t baleinegris-blog:latest .
run:
	docker run -d -p 127.0.0.1:8081:80 --name blog baleinegris-blog
destroy:
	docker stop blog
	docker rm blog
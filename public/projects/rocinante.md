# Raspberry Pi Server (Rocinante)  
___

&nbsp;
### The project
So what is the project? The project was getting my Raspberry Pi 4 (Rocinante) in shape to be a proper web server that I can use to host any future projects I might have. It's now in a state where it's plugged in only to power, so it doesn't need any kind of peripherals, and all monitoring is done via SSH and using [Portainer](https://www.portainer.io/). The only exposed ports on Rocinante are 80 (HTTP) and 443 (HTTPS), and any requests to Rocinante are automatically routed to the correct container using their search URL. All HTTPS traffic is encrypted with SSL/TLS, managed using Certbot and Let's Encrypt. All traffic from my domain "baleinegris.site" is redirected to a No-Ip DDNS that I set up, which is dynamically updated to always point to my router. The server is now hosting many websites, including this one!

&nbsp;

### The Stack:
<div style="display: flex; align-items: center; justify-content: space-between;">
<ul>
    <li>
        <img src="https://skillicons.dev/icons?i=raspberrypi" style="display: inline; vertical-align: middle;" /> Raspberry Pi 4 
    </li>
    <li>
        <img src="https://skillicons.dev/icons?i=nginx" style="display: inline; vertical-align: middle;" /> Nginx
    </li>
    <li>
        <img src="https://skillicons.dev/icons?i=docker" style="display: inline; vertical-align: middle;" /> Docker 
    </li>
</ul>
<img src="../Rocinante.png" height="300" width="300" alt="Rocinante">
</div>

&nbsp;


## Project Components
___
&nbsp;

### DDNS (Dynamic Domain Name Server)
Using No-Ip, I set up a DDNS, which is essentially just a link pointing to an IP, but that can be updated dynamically. Since my router changes IPs dynamically every so often, I need a way to always send traffic from my domain "baleinegris.site" to my router. All this means is that a little daemon runs on Rocinante, and every 5 minutes it sends an encrypted message to No-Ip letting it know what its global IP is. This means my DDNS link always points to the correct IP address.

&nbsp;
### Nginx Reverse Proxy
An important part of this project is Nginx, which is a HTTP web server and reverse proxy, which I use as the global gateway for the whole Raspberry Pi. 
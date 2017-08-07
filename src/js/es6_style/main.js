'use strict';

//绘制文字

;(function () {
    var canvas = {},
        image = {};
    var particles = [];

    canvas.obj = document.getElementById('myCanvas'); //位置
    canvas.image = function (drawFont) {
        var imageInfo = {};
        canvas.ctx.font = '100px microsoft yahei ';
        imageInfo = canvas.ctx.measureText(drawFont);
        canvas.ctx.textBaseline = 'hanging';
        canvas.ctx.fillStyle = '#DC143C'; //220,20,60
        canvas.ctx.fillText(drawFont, 0, 0);
        return {
            imageData: canvas.ctx.getImageData(0, 0, imageInfo.width, 100),
            w: imageInfo.width,
            h: 100
        };
    };

    if (canvas.obj.getContext) {
        canvas.ctx = canvas.obj.getContext('2d');
        canvas.w = canvas.obj.width = document.body.clientWidth;
        canvas.h = canvas.obj.height = document.body.clientHeight;

        //var img = new Image();
        // img.src = '../../images/isux.png'; //相当于 html中文件的位置
        // img.onload = function () {
        // image.obj = img;
        var str = ',我也要加油哦';
        var img = canvas.image(`中国梦,四川梦,上海梦${str}`);
        image.w = img.w;
        image.h = img.h;

        image.x = parseInt(canvas.w / 2 - image.w / 2);
        image.y = parseInt(canvas.h / 2 - image.h / 2);
        //canvas.ctx.drawImage(image.obj, image.x, image.y, image.w, image.h);
        // image.imageData = canvas.ctx.getImageData(image.x, image.y, image.w, image.h);
        image.imageData = img.imageData;

        calculate();
        draw();
        //};
    }

    function calculate() {

        // var cols = 30,
        //     rows = 30;

        // var s_width = parseInt(image.w / cols),
        //     s_height = parseInt(image.h / rows);

        var s_width = 1,
            s_height = 1;

        var cols = parseInt(image.w / s_width),
            rows = parseInt(image.h / s_height);
        var pos = 0;
        var par_x, par_y;
        var data = image.imageData.data;
        var now = new Date().getTime();
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {

                //计算(j,i)在数组中的R色值 坐标值
                pos = Math.floor((j * s_height * image.w + i * s_width) * 4); //计算结果转化为整数

                //判断(j，i)中的 R色值
                if (data[pos] > 100) {
                    var particle = {
                        // x: image.x + i * s_width + (Math.random() - 0.5) * 20,
                        x: image.x + i * s_width,
                        // y: image.y + j * s_height + (Math.random() - 0.5) * 20,
                        y: image.y + j * s_height,
                        flotage: false
                    };

                    //  if (data[pos + 1] < 175 && data[pos + 2] < 10) {
                        particle.fillStyle = '#fff';//'#ffa900';
                    // } else if (data[pos + 1] < 75 && data[pos + 2] > 50) {
                    //     particle.fillStyle = '#ff4085';
                    // } else if (data[pos + 1] < 255 && data[pos + 2] > 190) {
                    //     particle.fillStyle = '#00cfff';
                    // } else if (data[pos + 1] < 195 && data[pos + 2] > 175) {
                    //     particle.fillStyle = '#9abc1c';
                    // }
                    //if (i % 5 === 0 && j % 5 === 0) {
                    particle.flotage = true;

                    //保存开始坐标
                    particle.startX = particle.x;
                    particle.startY = particle.y;

                    //动画执行时间
                    particle.startTime = now + Math.random() * 20 * 1000;
                    particle.killTime = now + Math.random() * 35 * 1000;

                    //x,y方向的移动速度
                    particle.speedX = (Math.random() - 0.5) * 0.9;
                    particle.speedY = (Math.random() - 0.5) * 0.9;

                    //最后的坐标
                    particle.endX = particle.startX + particle.speedX * (particle.killTime - particle.startTime) / 16.7;
                    particle.endY = particle.startY + particle.speedY * (particle.killTime - particle.startTime) / 16.7;

                    particle.x = particle.endX;
                    particle.y = particle.endY;

                    //  }

                    particles.push(particle);
                }
            }
        }
    }

    //绘制图案
    function draw() {

        canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
        var easeOutQuad = function(e, a, g, f) {
			e /= f;
			return -g * e * (e - 2) + a
		};
        var len = particles.length;
        var curr_particle = null;
        var time = new Date().getTime();
        for (var i = 0; i < len; i++) {

            curr_particle = particles[i];


            if (curr_particle.flotage && curr_particle.startTime < time) {
                curr_particle.x -= curr_particle.speedX;
                curr_particle.y -= curr_particle.speedY;
				curr_particle.x = easeOutQuad(time - curr_particle.startTime,curr_particle.endX,curr_particle.startX - curr_particle.endX,curr_particle.killTime - curr_particle.startTime);
				curr_particle.y = easeOutQuad(time - curr_particle.startTime,curr_particle.endY,curr_particle.startY- curr_particle.endY ,curr_particle.killTime - curr_particle.startTime);


            }

            if (curr_particle.killTime < time) {


                curr_particle.x = curr_particle.startX;
                 curr_particle.y = curr_particle.startY;
                // curr_particle.x = curr_particle.endX;
                // curr_particle.y = curr_particle.endY;

                //  curr_particle.startTime = time + parseInt(Math.random() * 20) * 1000;
                // curr_particle.killTime = time + parseInt(Math.random() * 35) * 1000;
            }
            canvas.ctx.fillStyle = curr_particle.fillStyle;
            canvas.ctx.fillRect(curr_particle.x, curr_particle.y, 1, 1);
        }
        requestAnimationFrame(draw);
    }
})();

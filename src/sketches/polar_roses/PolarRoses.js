export default function PolarRoses(p){
    let n = 2;
    let d = 50;
    let dStep = 0.0001;
    let rScale;

    let theta = 0.0;

    let displayFullCurve = true;

    p.setup = () => {
        p.createCanvas(800, 800);
        // frameRate(60);
        p.colorMode(p.HSB, 360, 100, 100);
        // blendMode(ADD);

        rScale = p.width * p.sqrt(2);
    }

    p.draw = () => {
        p.background(0, 0, 0);
        p.stroke(0, 0, 100);
        p.noFill();

        p.translate(p.width / 2, p.height / 2);

        rScale = p.map(p.mouseY, p.height, 0, 100, p.width * p.sqrt(2));

        p.push();
        p.rotate(theta);
        p.beginShape();
        for(let i = p.radians(1); i < p.radians(361); i += p.radians(1)){
            const k = i * d;
            const r = rScale * p.sin(n * k);
            const x = r * p.cos(k);
            const y = r * p.sin(k);
            p.vertex(x, y);
        }
        p.endShape();
        p.pop();

        if(displayFullCurve){
            p.push();
            p.rotate(theta);
            theta += 0.0001;
            p.beginShape();
            for(let i = p.radians(0); i < p.radians(360); i += p.radians(0.1)){
                const r = rScale * p.sin(n * i);
                const x = r * p.cos(i);
                const y = r * p.sin(i);
                p.vertex(x, y);
            }
            p.endShape();
            p.pop();
        }

        d = (d + p.sin(dStep)) % 100;
        //d = map(d, -1, 1, 0, 100);

    }

    p.mouseClicked = () => {
        if(p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height){
            n = p.round(p.random(2, 100));
        }
    }

    p.keyPressed = () => {

        if(p.keyCode === p.UP_ARROW)
            dStep += 0.00001;
        else if(p.keyCode === p.DOWN_ARROW)
            dStep -= 0.00001;
        else if(p.keyCode === p.LEFT_ARROW)
            n--;
        else if(p.keyCode === p.RIGHT_ARROW)
            n++;


        if(p.key === ' ')
            displayFullCurve = !displayFullCurve;

    }

}
